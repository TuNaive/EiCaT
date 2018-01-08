import Base from './base.js'
import fs from 'mz/fs'


export default class extends Base {

  constructor (ctx) {
    super(ctx)
    this.uploadPath = think.ROOT_PATH + '/uploadFiles'
  }

  calcAction() {
    this.sub_channel = 'PCBA自助询价'
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
    const res = this.calculateFee(paramData)
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

  uploadAction () {
    const pcbaFile = this.file('pcbaFile')
    const { path, name } = pcbaFile
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
  calculateFee (params) {
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
    const icCount = _.toNumber(params.pointIC)
    const chipCount = _.toNumber(params.pointCHIP)
    const bgaCount = _.toNumber(params.pointBGA)
    const dipCount = _.toNumber(params.pointDIP)
    const boardCount = _.toNumber(params.boardNumber)
    const totalCount = (chipCount + icCount + bgaCount + dipCount) * boardCount
    let projceFee = 0.00
    if (totalCount <= 500000) {
      projceFee = 0.018 * (chipCount + icCount + bgaCount) * boardCount * 1.003 * 2 + 0.03 * dipCount * boardCount * 1.003 * 2 + 2.8 * boardCount + 800
    } else if (totalCount > 500000 && totalCount < 1000000) {
      projceFee = 0.018 * (chipCount + icCount + bgaCount) * boardCount * 1.003 * 2 + 0.03 * dipCount * boardCount * 1.003 * 2 + 2.8 * boardCount
    } else if (totalCount > 1000000) {
      projceFee = 0.017 * (chipCount + icCount + bgaCount) * boardCount * 1.003 * 2 + 0.02 * dipCount * boardCount * 1.003 * 2 + 2.8 * boardCount
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
