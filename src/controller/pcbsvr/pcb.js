import Base from './base.js'
import fs from 'mz/fs'

const enums = {
  pcbCustomOptions: {
    boardLayer: {
      label: '板子层数',
      value: ['单面', '双面', '四层', '六层', '八层']
    },
    boardMaterial: {
      label: '板材',
      value: ['FR4', 'CEM1', 'FR1', '铝基板']
    },
    boardThickness: {
      label: '板厚（mm）',
      value: ['0.4', '0.6', '0.8', '1.0', '1.2', '1.6', '2.0', '2.5']
    },
    boardAmount: {
      label: '数量'
      // value: ['5', '10', '20', '30', '40', '50', '60', '75', '100', '150', '200', '250', '300', '350', '400', '450', '500', '550', '600', '650', '700', '800', '900', '1000', '1500', '2000', '2500', '3000', '3500', '4000', '4500', '5000', '5500', '6000', '6500', '7000', '7500', '8000', '其他']
    },
    boardLength: {
      label: '板子尺寸长（CM）'
    },
    boardWidth: {
      label: '板子尺寸宽（CM）'
    },
    aluminumOutThickness: {
      label: '铜箔厚度 外层（oz）',
      value: ['1', '2']
    },
    aluminumInThickness: {
      label: '内层（oz）',
      value: ['0.5']
    },
    makeupNum: {
      label: '拼版款数',
      value: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
    },
    surfacing: {
      label: '表面处理',
      value: ['有铅喷锡', '无铅喷锡', '沉金', 'OSP', '光板']
    },
    solderMaskColor: {
      label: '阻焊颜色',
      value: ['绿色', '红色', '蓝色', '白色', '黑色', '哑光黑色', '无']
    },
    charColor: {
      label: '字符颜色',
      value: ['白色', '黄色', '黑色', '无']
    },
    minLineSpace: {
      label: '最小线宽线距',
      value: ['5/5mil以上']
    },
    minAperture: {
      label: '最小孔径',
      value: ['0.30mm以上']
    },
    holeAmount: {
      label: '孔数',
      value: ['10万孔以下/m²', '10-20万孔/m²', '20万孔以上/m²']
    },
    halfHole: {
      label: '半孔',
      value: ['无', '一边半孔', '二边半孔', '三边半孔', '四边半孔']
    },
    testMethod: {
      label: '测试方式',
      value: ['全部飞针测试(样板飞测免费)：光学AOI测试 + 飞针测试，成品直通率100%测试', '抽测免费：成品直通率95%以上测试：全部光学AOI测试 + 飞针测试抽测（如抽测过程中直通率低于95%，此批全部免费飞针测试 ）', '测试架测试：测试免费，测试架工具费为一次性收费，返单免费', '目测：用人工目检，适合单面板及简单的板']
    },
    urgent: {
      label: '加急',
      value: ['正常交期', '加急48小时', '加急24小时', '特快加急12小时', '火箭加急8小时']
    },
    delivery: {
      label: '交期'
    },
    comment: {
      label: '备注'
    }
  },
  pcbFee: {
    projectFee: '工程费',
    boardFee: '板费',
    makeupFee: '拼版费',
    specialBoardFee: '特殊板费',
    filmFee: '菲林费',
    surfaceFee: '表面处理费',
    testFee: '测试费',
    solderMaskColorFee: '阻焊颜色费',
    charColorFee: '字体颜色费',
    halfHoleFee: '半孔加工费',
    urgentFee: '加急费',
    otherFee: '其他',
    totalFee: '总费用'
  }
}

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
    this.sub_channel = 'PCB自助询价'
    return this.display()
  }

  enquireAction() {
    this.sub_channel = 'PCB工程师人工询价'
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
        label: enums.pcbCustomOptions[key].label,
        value: _.get(enums.pcbCustomOptions, `${key}.value.${val}`, val)
      }
    })
    customDetail.unshift({
      field: 'boardSize',
      label: '板子尺寸',
      value: `${pcbInfo.boardLength} cm x ${pcbInfo.boardWidth} cm`
    })

    const pcbFee = _.map(fee, (val, key) => ({
      field: key,
      label: enums.pcbFee[key],
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
    const projectPrice = await this.model('pcb_price').getPrice({boardLayer, option: 0})
    const makeupPrice = await this.model('pcb_price').getPrice({boardLayer, option: 1})
    const filmPrice = 5
    const boardPrice = await this.model('pcb_price').getPrice({boardLayer, boardMaterial})
    const surfacePrice = await this.model('pcb_price').getPrice({boardLayer: Math.min(boardLayer, 1), surfacing, boardThickness})
    const testPrice = 0.2 // 单位/平方米
    const urgentPrice = 100 // 100 线性递增
    const halfHolePrice = 55 // 双数递增

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

    if (!_.includes(['zip', 'rar'], suffix)) {
      return this.fail(-1, '不合法的文件后缀，仅支持zip、rar格式文件')
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
    const pcbKeys = _.keys(enums.pcbCustomOptions)
    const pcbInfo = _.pick(postParams, pcbKeys)
    const fee = await this.calculateFee(pcbInfo)
    const data = _.merge({}, _.omit(postParams, pcbKeys), fee)

    data.user_id = this.user.uid
    data.type = 0
    data.pcbInfo = JSON.stringify(pcbInfo)
    data.fee = JSON.stringify(fee)
    //PCB总费用
    data.real_amount = fee.totalFee;

    //运费计算
    //TODO: 根据重量和公司进行计算
    data.real_freight = data.freight;

    //付款总额
    data.order_amount = _.sum([data.real_amount, data.real_freight, data.tax]);

    //生成订单
    let order_id = await this.model("order").add(data);

    return this.success({name:'订单创建成功，正在跳转支付页面！',url:`/account/pay/index?order=${order_id}&setp=3`});
  }

  async createEnquireAction() {
    const postParams = this.post()

    postParams.user_id = this.user.uid
    postParams.type = 0

    await this.model('enquire').add(postParams)

    return this.success()
  }
}
