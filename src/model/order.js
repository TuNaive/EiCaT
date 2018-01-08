const enums = {
  order_type: {
    '0': 'P', // PCB
    '1': 'A' // PCBA
  },
  order_state: {
    '2': '等待审核',
    '3': '已审核'
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
}