/**
 * Created by dengyuying on 2017/10/20.
 */
import Base from './base.js'

export default class extends Base {
  __before() {
    super.__before()
    this.active = ['/pcb']
    this.channel = '个人中心'
  }

  /**
   * pcb订单管理
   * @returns {PreventPromise}
   */
  async pcbAction() {
    //判断是否登陆
    // await this.weblogin();

    let status = this.para("status") || null;
    let map = {
      type: 0,
      is_del: 0,
      user_id: this.user.uid
    }

    //当前位置
    if (!think.isEmpty(status)) {
      this.assign('status', status);
    }

    //筛选订单
    if (status == 0) {
      //未付款的订单
      _.merge(map, {
        pay_status: 0,
        delivery_status: ["!=", 1],
        status: ["NOTIN", [4, 6]]
      })
    } else if (status == 1) {
      //待收货的订单
      /*(item.pay_status == 1 or item.status ==3) and item.delivery_status != 1 and item.status != 6 and item.status != 4
      item.delivery_status == 1 and item.status != 6 and item.status != 4
      map={
          status: ["NOTIN", [4, 6]],
          delivery_status: ["!=", 1],
          is_del: 0,
          user_id: this.user.uid,
          _complex:{
              pay_status: 1,
              status: 3,
              _logic: "or"
          }
      }*/
      _.merge(map, {
        status: ["NOTIN", [4, 6]],
        delivery_status: 1
      })
    } else if (status == -1) {
      //待收货的订单
      /*(item.pay_status == 1 or item.status ==3) and item.delivery_status != 1 and item.status != 6 and item.status != 4
       item.delivery_status == 1 and item.status != 6 and item.status != 4
       map={
       status: ["NOTIN", [4, 6]],
       delivery_status: ["!=", 1],
       is_del: 0,
       user_id: this.user.uid,
       _complex:{
       pay_status: 1,
       status: 3,
       _logic: "or"
       }
       }*/
      _.merge(map, {
        is_del: 1
      })
    }

    // TODO: 关联 order 和 address
    let data = await this.model("order").where(map).fieldReverse('fee pcbInfo').page(this.para('page')).order("create_time DESC").countSelect();
    let html = this.pagination(data);

    this.assign('pagination', html);

    for (let val of data.data) {
      // switch (val.payment) {
      //   case 100:
      //     val.channel = "预付款支付";
      //     break;
      //   case 1001:
      //     val.channel = "货到付款";
      //     break;
      //   default:
      //     // 付款方式
      //     val.channel = await this.model("pingxx").where({id: val.payment}).getField("title", true);
      // }

      const address = await this.getOrderAddress(val.address_id)
      _.merge(val, address)

      //未付款订单倒计时
      // if (val.pay_status == 0) {
      //   val.end_time = moment(val.create_time + (Number(this.config('setup.ORDER_DELAY')) * 60000)).format('MMM D, YYYY H:m:s')
      // }
      //console.log(this.setup.ORDER_DELAY_BUND)
      //查出订单里面的商品列表
      /*val.goods = await this.model("order_goods").where({order_id: val.id}).select();
      let numarr=[];
      for (let v of val.goods) {
        v.prom_goods = JSON.parse(v.prom_goods);
        numarr.push(v.goods_nums);
        v = think.extend(v, v.prom_goods);
        delete v.prom_goods;
      }
      val.nums = eval(numarr.join("+"));*/
    }

    //未付款统计
    let nopaid = await this.model("order").where({
      type: 0,
      pay_status: 0,
      delivery_status: ["!=", 1],
      status: ["NOTIN", [4, 6]],
      is_del: 0,
      user_id: this.user.uid,
    }).count("id");
    this.assign("nopaid", nopaid);
    //未付款统计
    let receipt = await this.model("order").where({
      type: 0,
      status: ["NOTIN", [4, 6]],
      delivery_status: 1,
      is_del: 0,
      user_id: this.user.uid,
    }).count("id");
    this.assign("nopaid", nopaid);
    this.assign("receipt", receipt);
    this.assign("count",data.count);
    this.assign('list', data.data);
    this.meta_title = "我的订单";

    return this.display();
  }

  /**
   * pcb订单详情
   * @returns {PreventPromise}
   */
  async pcbDetailAction() {
    let data = await this.model("order").where({
      id: this.para('id')
    }).find();

    const formattedData = this.controller('pcbsvr/pcb').formatPcbLabel(data.pcbInfo, data.fee, ['boardAmount', 'delivery', 'comment'])

    const testMethodIdx = _.findIndex(formattedData.customDetail, {field: 'testMethod'})
    const testMethod = formattedData.customDetail[testMethodIdx]

    const address = await this.getOrderAddress(data.address_id)

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

    this.assign('data', data);
    this.meta_title = "订单详情";

    return this.display();
  }

  async getOrderAddress(addressId) {
    const resAddr = {}
    let address = await this.model("address").where({id: addressId}).find()

    resAddr.address = _.merge(address, {
      province: await this.model("area").where({id: address.province}).getField("name", true),
      city: await this.model("area").where({id: address.city}).getField("name", true),
      county: await this.model("area").where({id: address.county}).getField("name", true)
    })

    return resAddr
  }

  //删除订单
  async deleteAction() {
    //判断是否登陆
    // await this.weblogin();

    let res;
    let type = this.get("type") || null;
    if (think.isEmpty(type)) {
      let map = {
        id: this.get("id"),
        user_id: this.user.uid,
        pay_status: 0
      }
      res = await this.model("order").where(map).update({is_del: 1});
    } else {
      res = await this.model("order").where({id: this.get("id"), user_id: this.user.uid}).delete()
    }

    if (res) {
      return this.success({name: "删除成功！"});
    } else {
      return this.fail("删除失败!");
    }
  }

  //确认收货
  async confirmreceiptAction() {
    //判断是否登陆
    await this.weblogin();
    let map = {
      id: this.get("id"),
      user_id: this.user.uid,
      delivery_status: 1,
      status: ["NOTIN", [4, 6]]
    }
    let res = await this.model("order").where(map).update({status: 4});
    if (res) {
      return this.success({name: "操作成功！"});
    } else {
      return this.fail("操作失败!");
    }
  }
}