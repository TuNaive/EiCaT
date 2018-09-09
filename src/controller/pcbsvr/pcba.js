import Base from './base.js'
import fs from 'mz/fs'

export default class extends Base {

  constructor (ctx) {
    super(ctx)
    this.uploadPath = think.ROOT_PATH + '/uploadFiles'
  }
  __before() {
    return super.__before(true, true).then(data => {
      return data
    })
  }
  async calcAction() {
    let express = await this.model("express_company").select();
    this.assign('express', express);
    this.sub_channel = `PCBA ${this.__.jed.dgettext('smt', 'order')}`;
    // this.assign({
    //   sub_channel: 'PCBA自助询价'
    // })
    return this.display()
  }

  enquireAction() {
    this.sub_channel = 'PCBA工程师人工询价'
    return this.display()
  }

  invoiceAction() {
    return this.display()
  }

  async calculateAction() {
    let paramData = this.post()
    const res = await this.calculateFee(paramData)
    paramData = _.assign({}, paramData, res)
    this.body = {
      rtnCode: 0,
      data: {
        ...paramData
      }
    }
  }

  /**
   * 获取收货地址
   * @returns {PreventPromise}
   */
  async getAddressAction () {
    const addressList = await this.service('account/address').getAddressList(this, this.post());

    this.body = {
      rtnCode: 0,
      data: addressList
    }
  }

  /**
   * 获取发票信息
   * @returns {PreventPromise}
   */
  async getInvoiceAction () {
    const invoiceList = await this.service('account/invoice').getInvoiceList(this, this.post());

    this.body = {
      rtnCode: 0,
      data: invoiceList
    }
  }

  async uploadAction () {
    const pcbaFile = this.file('pcbaFile')
    const { path, name, size } = pcbaFile
    const suffix = _.last(_.split(name,  '.'))

    if (size > 1024 * 1024 * 40) {
      return this.fail(-1, '允许上传文件大小在40M以内')
    }

    if (!_.includes(['zip', 'rar', 'xlsx', 'xls'], suffix)) {
      return this.fail(-1, '不合法的文件后缀，仅支持zip、rar、xlsx、xls格式文件')
    }
    const uuid = think.uuid(`userUuid_${Date.now()}_${name}`)

    think.mkdir(this.uploadPath)

    var readStream = fs.createReadStream(path)
    var writeStream = fs.createWriteStream(`${this.uploadPath}/${uuid}`)
    readStream.pipe(writeStream)

    this.body = {
      rtnCode: 0,
      data: Object.assign({}, _.pick(pcbaFile, ['name', 'size']), { uuid })
    }
  }

  async createOrderAction () {

    const postParams = this.post()

    const fee = this.calculateFee(postParams)

    let data = _.merge(postParams, fee)

    data.user_id = this.user.uid

    data.type = 1

    data.order_amount = data.totalFee

    data.address_id = data.addressId

    data.order_no = this.model('order').getOrderid(this.user.uid)

    const res = await this.model('order').add(data)

    if (!_.isNil(res)) {
      this.body = {
        rtnCode: 0,
        rtnMsg: '订单保存成功'
      }
    } else {
      this.body = {
        rtnCode: 999,
        rtnMsg: '下单失败'
      }
    }
  }

  /**
   * 100万点以上价格结算：0.017*点数*（1+0.002）*2 + （2 + 0.8）*订单
   *    0.017*点数*（1+0.003）*2 + 0.02*dip (1 + 0.003)*2 + 0.018*点数*（1+0.003）*2 + （2 + 0.8）*订单
   *
   * 50—100万点以上价格结算：0.018*点数*（1+0.003）*2 + 0.03*dip (1 + 0.003)*2 + （2 + 0.8）*订单
   * 50万点以内：
   *     0.018*点数*（1+0.003）*2 + 0.03*dip (1 + 0.003)*2 + （2 + 0.8）*订单 + 800（工程费）
   * 
   */
  async calculateFee (params) {
    const price = await this.model('pcba_price').where({id: 1}).find();
    const plateObj = {
      '1': 99.00,
      '2': 110.00,
      '3': 187.00,
      '4': 297.00,
      '5': 362.00,
      '6': 451.00,
      '7': 528.00,
      '8': 572.00
    }
    let Fee = {}
    Fee.platesizeFee = plateObj[params.plateSize].toFixed(2)
    Fee.otherFee = '0.00'
    const icCount = _.toNumber(params.pointIc)
    const chipCount = _.toNumber(params.pointChip)
    const bgaCount = _.toNumber(params.pointBga)
    const dipCount = _.toNumber(params.pointDip)
    const boardCount = _.toNumber(params.boardNumber)
    const totalCount = (chipCount + icCount + bgaCount + dipCount) * boardCount
    let projceFee = 0.00
    if (totalCount <= 500000) {
      projceFee = price.quotie1 * (chipCount + icCount + bgaCount) * boardCount * (1 + price.quotie2) * 2 + price.quotie3 * dipCount * boardCount * (1 + price.quotie4) * 2 + (2 + price.quotie5) * boardCount + price.quotie0
    } else if (totalCount > 500000 && totalCount < 1000000) {
      projceFee = price.quotie6 * (chipCount + icCount + bgaCount) * boardCount * (1 + price.quotie7) * 2 + price.quotie8 * dipCount * boardCount * (1 + price.quotie9) * 2 + (2 + price.quotie10) * boardCount
    } else if (totalCount > 1000000) {
      projceFee = price.quotie11 * (chipCount + icCount + bgaCount) * boardCount * (1 + price.quotie12) * 2 + price.quotie13 * dipCount * boardCount * (1 + price.quotie14) * 2 + (2 + price.quotie15) * boardCount
    }
    Fee.projceFee = projceFee.toFixed(2)
    Fee.totalFee = _.toNumber(Fee.platesizeFee) + _.toNumber(Fee.projceFee) + _.toNumber(Fee.otherFee)
    Fee.totalFee = Fee.totalFee.toFixed(2)
    return Fee
  }
  __call () {
    console.log('-------call-method')
  }

   __after () {
    console.log('-----after')
  }

}
