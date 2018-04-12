import Base from './base.js'
import fs from 'mz/fs'
import { pcbEnums } from './enums.js'

export default class extends Base {
  constructor(ctx) {
    super(ctx)
    this.uploadPath = think.ROOT_PATH + '/uploadFiles'
  }

  __before() {
    return super.__before(true).then(data => {
      return data
    })
  }

  async calcAction() {
    let express = await this.model("express_company").select();
    this.assign('express', express);
    this.sub_channel = `PCB ${this.__.jed.dgettext('smt', 'order')}`;
    return this.display()
  }

  enquireAction() {
    const type = this.get('type')
    let title = ''
    this.assign('type', type)
    this.assign('title', title = type === '0' ? 'PCB' : 'PCBA')
    this.sub_channel = type === '0' ? 'PCB工程师人工询价' : 'PCBA工程师人工询价'
    return this.display()
  }

  /**
   * 获取收货地址
   * @returns {PreventPromise}
   */
  async getAddressAction() {
    // 判断是否登陆
    // await this.weblogin();

    const addressList = await this.service('account/address').getAddressList(this, this.post())

    return this.success(addressList)
  }

  async calculateAction() {
    const postParams = this.post()
    const { boardLength, boardWidth, boardAmount } = postParams

    const fee = await this.calculateFee(postParams)

    const res = this.formatPcbLabel(postParams, fee)

    this.assign(res)

    this.success(res)
  }

  formatPcbLabel (pcbInfo, fee, omitPcbFields = []) {
    omitPcbFields = _.concat(['boardLength', 'boardWidth'], omitPcbFields)
    const customDetail = _.map(_.omit(pcbInfo, omitPcbFields), (val, key) => {
      return {
        field: key,
        label: pcbEnums.pcbCustomOptions[key].label,
        value: _.get(pcbEnums.pcbCustomOptions, `${key}.value.${val}`, val)
      }
    })
    customDetail.unshift({
      field: 'boardSize',
      label: '板子尺寸',
      value: `${pcbInfo.boardLength} cm x ${pcbInfo.boardWidth} cm`
    })

    const pcbFee = _.map(fee, (val, key) => ({
      field: key,
      label: pcbEnums.pcbFee[key],
      value: val
    }))

    return {
      customDetail,
      pcbFee
    }
  }

  async calculateFee (params) {
    const {boardLength, boardWidth, boardLayer, boardMaterial, boardThickness, boardAmount, aluminumOutThickness, aluminumInThickness, makeupNum, surfacing, solderMaskColor, charColor, minLineSpace, minAperture, holeAmount, halfHole, testMethod, urgent, comment} = params
    const boardSize = boardLength * boardWidth
    const projectPrice = await this.model('pcb_price').getPrice({boardLayer, option: 'project'})
    const makeupPrice = await this.model('pcb_price').getPrice({boardLayer, option: 'makeup'})
    const filmPrice = await this.model('pcb_price').getPrice({option: 'film'})
    const boardPrice = await this.model('pcb_price').getPrice({boardLayer, boardMaterial})
    const surfacePrice = await this.model('pcb_price').getPrice({boardLayer: Math.min(boardLayer, 1), surfacing, boardThickness})
    const testPrice = await this.model('pcb_price').getPrice({option: 'test'}) // 单位/平方米
    const urgentPrice = await this.model('pcb_price').getPrice({option: 'urgent'}) // 100 线性递增
    const halfHolePrice = await this.model('pcb_price').getPrice({option: 'halfHole'}) // 双数递增

    const fee = {}

    const boardAreaAmount = Math.ceil(boardAmount / ((102 / boardWidth + 5) * (102 / boardLength + 5)))
    const areaAmount = boardAmount * boardWidth * boardLength / 100

    fee.projectFee = this.round2(projectPrice)
    fee.boardFee = this.round2(boardAreaAmount * boardPrice)
    fee.makeupFee = this.round2(areaAmount * makeupPrice)
    fee.specialBoardFee = this.round2(0)
    fee.filmFee = this.round2(areaAmount * filmPrice)
    fee.surfaceFee = this.round2(areaAmount * surfacePrice)
    fee.testFee = this.round2(areaAmount * testPrice)
    fee.solderMaskColorFee = this.round2(0)
    fee.charColorFee = this.round2(0)
    fee.halfHoleFee = this.round2(Math.floor(halfHole / 2) * halfHolePrice)
    fee.urgentFee = this.round2( urgent * urgentPrice)
    fee.otherFee = this.round2(0)
    fee.totalFee = this.round2(_.sum(_.values(fee)))

    return fee
  }

  round2 (num) {
    return NP.round(num, 2)
  }

  async uploadAction() {
    const pcbFile = this.file('pcbFile')
    const {path, name, size} = pcbFile
    const suffix = _.last(_.split(name,  '.'))

    if (size > 1024 * 1024 * 40) {
      return this.fail(-1, '允许上传文件大小在40M以内')
    }

    if (!_.includes(['zip', 'rar', 'xlsx'], suffix)) {
      return this.fail(-1, '不合法的文件后缀，仅支持zip、rar、xlsx格式文件')
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
      ..._.pick(pcbFile, ['name', 'size']),
      uuid
    })
  }

  async downloadAction() {
    const uuid = this.get('uuid')
    const path = `${this.uploadPath}/${uuid}`

    this.ctx.set('content-disposition', `attachment;filename=${encodeURIComponent(_.last(_.split(uuid, '_')))}`)

    try {
      const file = await fs.readFile(path)
      return this.body = file
    } catch (err) {
      return this.body = 'no such file'
    }
  }

  async clearUploadFileAction() {
    const orderFiles = await this.model('pcb_order').getFiles()

    /*todo: 上传时间小于一天的不删除*/

    const existFiles = await fs.readdir(this.uploadPath)
    const deleteFiles = _.difference(existFiles, orderFiles)

    _.forEach(deleteFiles, (uuid, idx) => {
      fs.unlinkSync(`${this.uploadPath}/${uuid}`)
    })

    // this.logger.info('clear upload file success')
  }

  // 创建订单
  async createOrderAction(){
    // await this.weblogin();

    const postParams = this.post();
    const pcbKeys = _.keys(pcbEnums.pcbCustomOptions)
    const pcbInfo = _.pick(postParams, pcbKeys)
    const fee = await this.calculateFee(pcbInfo)
    const data = _.merge({}, _.omit(postParams, pcbKeys), fee)

    data.order_no = this.model('order').getOrderid(this.user.uid)
    data.user_id = this.user.uid
    data.type = 0
    data.pcbInfo = JSON.stringify(pcbInfo)
    data.fee = JSON.stringify(fee)
    //PCB总费用
    data.real_amount = fee.totalFee;

    //运费计算
    //TODO: 根据重量和公司进行计算
    data.real_freight = data.freight;

    // todo: 快递方式

    //付款总额
    data.order_amount = _.sum([_.toNumber(data.real_amount), _.toNumber(data.real_freight), _.toNumber(data.tax)]);

    if (await this.model('setting').getPayOnline() != 1) {
      data.payment = 1002
    } else {
      data.payment = 1
    }

    //生成订单
    let order_id = await this.model("order").add(data);

    return this.success({name:'订单创建成功，正在跳转支付页面！',url:`/account/pay/index?order=${order_id}&setp=3`});
  }

  async createEnquireAction() {
    const postParams = this.post()

    postParams.user_id = this.user.uid
    postParams.order_no = this.model('enquire').getOrderid(this.user.uid)

    await this.model('enquire').add(postParams)

    return this.success()
  }
}
