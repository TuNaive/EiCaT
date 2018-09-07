import Base from './base.js'
import fs from 'mz/fs'

export default class extends Base {
  constructor(ctx) {
    super(ctx)
    this.uploadPath = think.ROOT_PATH + '/uploadFiles'
  }

  __before() {
    return super.__before(true).then(data => {
      this.active = ['/pcb']
      this.channel = '个人中心'
      return data
    })
  }

  /**
   * 商城订单管理
   * @returns {PreventPromise}
   */
  async shopAction() {
    const type = 2
    const status = this.get('status') || null

    await this.setupOrder(type, status)

    return this.display();
  }

  /**
   * pcb订单管理
   * @returns {PreventPromise}
   */
  async pcbAction() {

    console.log('pcb order', this.get('type'))
    const type = this.get('type') || null
    const status = this.get('status') || null

    await this.setupOrder(type, status)

    return this.display();
  }

  /**
   * pcba订单管理
   * @returns {PreventPromise}
   */
  // async pcbaAction() {

  //  console.log('pcba order')

  //  await this.setupOrder(1)

  //  return this.display()
  // }

  async setupOrder(type, status) {
    //判断是否登陆
    await this.weblogin();

    // let status = this.para("status") || null;
    let map = {
      type: type,
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

    let address_id = data.address_id

    for (let val of data.data) {
      /*switch (val.payment) {
       case 100:
       val.channel = "预付款支付";
       break;
       case 1001:
       val.channel = "货到付款";
       break;
       default:
       // 付款方式
       val.channel = await this.model("pingxx").where({id: val.payment}).getField("title", true);
       }*/
      if (!_.isNil(val.address_id) && !_.isEqual(val.address_id, 0)) {
        address_id = val.address_id
      }
      const address = await this.getOrderAddress(address_id)
      _.merge(val, address)

      //未付款订单倒计时
      if (this.model('order').isShopOrder(type) && val.pay_status == 0) {
        val.end_time = moment(val.create_time + (Number(this.config('settings.ORDER_DELAY')) * 60000)).format('M D, YYYY H:m:s')
      }
      //查出订单里面的商品列表
      val.goods = await this.model("order_goods").where({order_id: val.id}).select();
      let numarr = [];
      for (let v of val.goods) {
        v.prom_goods = JSON.parse(v.prom_goods);
        numarr.push(v.goods_nums);
        v = think.extend(v, v.prom_goods);
        delete v.prom_goods;
      }
      val.nums = eval(numarr.join("+"));
    }

    //未付款统计
    let nopaid = await this.model("order").where({
      type: type,
      pay_status: 0,
      delivery_status: ["!=", 1],
      status: ["NOTIN", [4, 6]],
      is_del: 0,
      user_id: this.user.uid,
    }).count("id");
    //未付款统计
    let receipt = await this.model("order").where({
      type: type,
      status: ["NOTIN", [4, 6]],
      delivery_status: 1,
      is_del: 0,
      user_id: this.user.uid,
    }).count("id");
    this.assign("nopaid", nopaid);
    this.assign("receipt", receipt);
    this.assign("count", data.count);
    this.assign('list', data.data);
    this.assign('type', type)
    this.meta_title = "我的订单";
  }

  /**
   * 商城订单详情
   * @returns {PreventPromise}
   */
  async shopDetailAction() {
    const orderId = this.get('id')
    const orderInfo = await this.model("order").where({id: orderId}).find()
    this.assign('data', orderInfo)

    //查出订单里面的商品列表
    const goods = await this.model("order_goods").where({order_id: orderId}).select();
    for (let v of goods) {
      v.prom_goods = JSON.parse(v.prom_goods);
      v = think.extend(v, v.prom_goods);
      delete v.prom_goods;
    }
    this.assign('goods', goods)

    // 支付概览
    await this.controller('account/cart').getPayOverview.call(this, goods)

    // 支付方式
    const payment = await this.controller('admin/order').getPaymentInfo(orderInfo.payment)
    this.assign('payment', payment)

    // 收货人信息
    const { address } = await this.model('address').getAddress(orderInfo.address_id)
    this.assign('address', address)

    this.meta_title = "订单详情";

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

    await this.model('order').formatPcbDetail(data, this)

    const invoice = await this.getOrderInvoice(data.invoiceId)

    _.merge(data, invoice)

    this.assign('data', data);
    this.meta_title = "订单详情";

    return this.display();
  }

  async pcbaDetailAction() {
    let data = await this.model("order").where({
      id: this.para('id')
    }).find();

    const address = await this.getOrderAddress(data.address_id)

    _.merge(data, address)

    const invoice = await this.getOrderInvoice(data.invoiceId)

    _.merge(data, invoice)

    data.plateSize = this.setupPlateSize(data.plateSize)

    this.assign('data', data)

    return this.display()
  }

  setupPlateSize(size) {
    const plateEnum = {
      '1': '300*400mm',
      '2': '370*470mm',
      '3': '420*520mm',
      '4': '550*650mm',
      '5': '400*600mm',
      '6': '400*800mm',
      '7': '400*1200mm',
      '8': '400*1400mm'
    }
    return plateEnum[size]
  }

  // todo: 替换为model address的方法
  async getOrderAddress(addressId) {
    const resAddr = {}
    let address = await this.model("address").where({id: addressId}).find()
    if (_.isEmpty(address)) {
      return false
    }
    console.log("==============address", addressId, address)
    resAddr.address = _.merge(address, {
      province: await this.model("area").where({id: address.province}).getField("name", true),
      city: await this.model("area").where({id: address.city}).getField("name", true),
      county: await this.model("area").where({id: address.county}).getField("name", true)
    })

    return resAddr
  }

  async getOrderInvoice(invoiceId) {

    let invoice = await this.model("invoice").where({id: invoiceId}).find()

    return invoice
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

  async updateAction() {
    // 用户上传水单

    let pay_code = this.post("payment");
    let receiptUuid = this.post("receipt_uuid");

    let map = {
      id: this.post("order_id"),
    }
    var res = await this.model("order").where(map).update({
      pay_code: pay_code,
      receiptUuid: receiptUuid,
      pay_status: 1
    });

    return this.success({name: "更新成功，请等待管理员审核后发货！"});
  }

  async uploadReceiptAction() {
    const receiptFile = this.file('receiptFile')
    const {path, name, size} = receiptFile
    const suffix = _.last(_.split(name,  '.'))

    if (size > 1024 * 1024 * 40) {
      return this.fail(-1, '允许上传文件大小在40M以内')
    }

    if (!_.includes(['jpg', 'jpeg', 'png', 'gif', 'bmp'], suffix)) {
      return this.fail(-1, '不合法的文件后缀，仅支持jpg、png、gif、bmp格式文件')
    }

    // todo: add user info
    let uuid = think.uuid(`userUuid_${Date.now()}`)
    uuid = `${uuid}_${name}`

    think.mkdir(this.uploadPath)

    var readStream = fs.createReadStream(path)
    var writeStream = fs.createWriteStream(`${this.uploadPath}/${uuid}`)
    readStream.pipe(writeStream)

    // await fs.rename(path, `${this.uploadPath}/${uuid}`)

    return this.success({
      ..._.pick(receiptFile, ['name', 'size']),
      uuid
    })
  }

  //确认收货
  async confirmreceiptAction() {
    //判断是否登陆
    // await this.weblogin();
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