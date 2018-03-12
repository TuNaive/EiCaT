const enums = {
  order_type: {
    '0': 'P', // PCB
    '1': 'A', // PCBA
    '2': 'S' // 商城订单
  },
  order_state: {
    '2': '等待审核',
    '3': '已审核'
  },
  status: {
    '2': '等待审核',
    '3': '已审核',
    '4': '确认收货',
    '6': '规定时间未付款系统自动作废'
  },
  pay_state: {
    '0': '未付款',
    '1': '已付款',
    '2': '付款失败'
  },
  delivery_status: {
    '0': '未发货',
    '1': '已发货'
  }
}

export default class extends think.Model {
  // todo: relation 无效
  get relation () {
    return {
      address: {
        type: think.Model.BELONG_TO
      }
    }
  }

  beforeAdd (data) {
    data.create_time = moment.now()
    //支付状态 pay_status 0:未付款 ,1:已付款
    data.pay_status = 0;
    //订单状态 status 2:等待审核，3:已审核
    data.status = 2;
    //发货状态 delivery_status 0:未发货，1:已发货
    data.delivery_status = 0;

    return data
  }

  async afterAdd (data) {
    await this.model("approval").adds(9, data.user_id, '创建订单', {}, data.id);
  }

  afterFind (data) {
    return this.processQueryData(data)
  }

  afterSelect (data) {
    return _.map(data, (obj, idx) => {
      return this.processQueryData(obj)
    })
  }

  processQueryData (obj) {
    obj._order_no = `O${_.get(enums.order_type, obj.type)}${_.toString(obj.create_time).slice(0, -3)}${_.padStart(obj.id, 6, 0)}`
    obj._create_time = moment(_.toNumber(obj.create_time)).format('YYYY-MM-DD HH:mm:ss')
    obj._state = _.get(enums, `order_state.${obj.state}`)
    obj._pay_state = _.get(enums, `pay_state.${obj.pay_state}`)
    obj._delivery_status = _.get(enums, `delivery_status.${obj.delivery_status}`)

    obj.fee && (obj.fee = JSON.parse(obj.fee))
    obj.pcbInfo && (obj.pcbInfo = JSON.parse(obj.pcbInfo))

    return obj
  }

  getOrderid(uid) {
    // 用户id+毫秒时间戳后5位
    const m = new Date().getTime().toString();
    return _.padEnd(uid, 10, '0') + m.substr(8);
  }

  async formatPcbDetail (data, ctrl) {
    const formattedData = ctrl.controller('pcbsvr/pcb').formatPcbLabel(data.pcbInfo, data.fee, ['boardAmount', 'delivery', 'comment'])

    const testMethodIdx = _.findIndex(formattedData.customDetail, {field: 'testMethod'})
    const testMethod = formattedData.customDetail[testMethodIdx]

    const address = await this.model('address').getAddress(data.address_id)

    _.merge(data, address)

    formattedData.customDetail.splice(testMethodIdx, 1)
    data._pcbInfo = formattedData.customDetail

    _.remove(formattedData.pcbFee, obj => obj.field === 'totalFee')

    data._fee = formattedData.pcbFee

    data._fee = _.concat(data._fee, [
      {
        label: '运费',
        field: 'freight',
        value: data.real_freight
      },
      {
        label: '税费',
        field: 'tax',
        value: data.tax
      }
    ])

    data.pcbInfo._testMethod = testMethod.value
  }

  /**
   * 增减库存
   * @param oder_id 订单id
   * @param regulation true-减库存，false-加库存
   * @param sku sku字段 默认 "suk",自建模型减少库存是需要填写自己新建的字段名
   * @param stock 库存 默认 "total_stock",
   */
  async stock(oder_id, regulation = true, sku = "suk", stock = "total_stock") {

    let goodlist = await this.model("order_goods").where({order_id: oder_id}).select();
    // console.log(goodlist);
    // return false;
    for (let val of goodlist) {
      let model_id = await this.model("document").where({id: val.goods_id}).getField("model_id", true);
      //获取模型数据
      let table = await this.model("model").get_table_name(model_id);
      let model = this.model(table);
      let prom_goods = JSON.parse(val.prom_goods);
      if (!think.isEmpty(prom_goods.type)) {

        let data = await model.where({id: val.goods_id}).getField(sku, true);
        data = JSON.parse(data);
        let type = prom_goods.type.split(",");
        //console.log(type);
        for (let v of data.data) {
          if (v.ch && v.name == type[0]) {
            for (let _v of v.ch) {
              if (_v.ch && _v.name == type[1]) {

                for (let __v of _v.ch) {
                  if (__v.name == type[2]) {
                    if (regulation) {
                      __v.sku_stock = Number(__v.sku_stock) - val.goods_nums;
                    } else {
                      __v.sku_stock = Number(__v.sku_stock) + val.goods_nums;
                    }

                  }
                }
              } else {
                if (_v.name == type[1]) {
                  if (regulation) {
                    _v.sku_stock = Number(_v.sku_stock) - val.goods_nums;
                  } else {
                    _v.sku_stock = Number(_v.sku_stock) + val.goods_nums;
                  }

                }
              }
            }
          } else {
            if (v.name == type[0]) {
              if (regulation) {
                v.sku_stock = Number(v.sku_stock) - val.goods_nums;
              } else {
                v.sku_stock = Number(v.sku_stock) + val.goods_nums;
              }

            }
          }

        }

        let date = {}
        date[sku] = JSON.stringify(data);
        await model.where({id: val.goods_id}).update(date);
      }
      if (regulation) {
        //减库存
        await model.where({id: val.goods_id}).decrement(stock, val.goods_nums);
      } else {
        //加库存
        await model.where({id: val.goods_id}).increment(stock, val.goods_nums);
      }


    }


  }

  /**
   *
   * @param goods_id 商品id
   * @param type 商品sku类型
   * @param sku  新建模型的 sku 字段名
   * @param stock 新建模型的 总库存字段名
   * @returns {*} 库存数量
   */
  async getstock(goods_id, type, sku = "suk", stock = "total_stock") {
    let ressku;
    let model_id = await this.model("document").where({id: goods_id}).getField("model_id", true);
    // 如果宝贝不存在则库存为0
    if (!model_id) {
      return 0;
    }
    //获取模型数据
    let table = await this.model("model").get_table_name(model_id);
    let model = this.model(table);
    if (think.isEmpty(type)) {
      ressku = await model.where({id: goods_id}).getField(stock, true);
    } else {
      let data = await model.where({id: goods_id}).getField(sku, true);
      data = JSON.parse(data);
      type = type.split(",");
      let skuarr = [];
      for (let v of data.data) {
        if (v.ch && v.name == type[0]) {
          for (let _v of v.ch) {
            if (_v.ch && _v.name == type[1]) {

              for (let __v of _v.ch) {
                if (__v.name == type[2]) {

                  skuarr.push(Number(__v.sku_stock));

                }
              }
            } else {
              if (_v.name == type[1]) {
                skuarr.push(Number(_v.sku_stock));

              }
            }
          }
        } else {
          if (v.name == type[0]) {
            skuarr.push(Number(v.sku_stock));
          }
        }

      }
      ressku = skuarr[0]
    }
    return ressku;
  }

  isShangchengOrder (type) {
    return type === 2
  }
}