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
    totalFee: '总费'
  }
}

export default class extends Base {
  constructor(ctx) {
    super(ctx)

    // todo: for test
    this.user = {
      uid: 1
    }

    this.uploadPath = think.ROOT_PATH + '/uploadFiles'
  }

  async calcAction() {
    let data = await this.model("address").where({user_id: this.user.uid}).order("is_default DESC,id DESC").select()

    if (!think.isEmpty(data.data)) {
      for (let val of data.data) {
        // val.province_num = val.province;
        // val.city_num = val.city;
        // val.county_num = val.county;
        val.province = await this.model("area").where({id: val.province}).getField("name", true);
        val.city = await this.model("area").where({id: val.city}).getField("name", true);
        val.county = await this.model("area").where({id: val.county}).getField("name", true);
      }
    }

    this.assign("list", data);

    this.sub_channel = 'PCB自助询价'

    return this.display()
  }

  enquireAction() {
    this.sub_channel = 'PCB工程师人工询价'
    return this.display()
  }

  async calculateAction() {
    const postParams = this.post()
    const { boardLength, boardWidth, boardAmount } = postParams
    const priceRecord = await this.model('pcb_price').getCachedPrice(_.omit(postParams, ['boardLength', 'boardWidth', 'boardAmount', 'comment']))
    const price = priceRecord.price

    const customDetail = _.map(_.omit(postParams, ['boardLength', 'boardWidth']), (val, key) => {
      return {
        field: key,
        label: enums.pcbCustomOptions[key].label,
        value: _.get(enums.pcbCustomOptions, `${key}.value.${val}`, val)
      }
    })
    customDetail.unshift({
      field: 'boardSize',
      label: '板子尺寸',
      value: `${postParams.boardLength} cm x ${postParams.boardWidth} cm`
    })

    const fee = {
      projectFee: 55,
      boardFee: 11,
      makeupFee: 22,
      specialBoardFee: 33,
      filmFee: 44,
      surfaceFee: 55,
      testFee: 66,
      solderMaskColorFee: 77,
      charColorFee: 88,
      halfHoleFee: 99,
      urgentFee: 100,
      otherFee: 111,
      totalFee: 222
    }

    const pcbFee = _.map(fee, (val, key) => ({
      field: key,
      label: enums.pcbFee[key],
      value: val
    }))

    this.assign({
      customDetail,
      pcbFee
    })

    this.body = {
      rtnCode: 0,
      data: {
        customDetail,
        pcbFee
      }
    }
  }

  async uploadAction() {
    const pcbFile = this.file('pcbFile')
    const {path, name} = pcbFile
    // todo: add user info
    const uuid = think.uuid(`userUuid_${Date.now()}_${name}`)

    think.mkdir(this.uploadPath)

    await fs.rename(path, `${this.uploadPath}/${uuid}`)

    this.body = {
      rtnCode: 0,
      data: {
        ..._.pick(pcbFile, ['name', 'size']),
        uuid
      }
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
}
