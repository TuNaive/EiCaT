const enums = {
  enquire_type: {
    '0': 'P', // PCB
    '1': 'A' // PCBA
  },
  status: { // 询价单状态
    '0': '等待回复',
    '1': '已回复',
    '-1': '已取消'
  }
}

export default class extends think.Model {
  beforeAdd (data) {
    data.user_id = think.user.uid
    data.create_time = moment.now()
    // 询价单状态
    data.status = 0

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

  async getList ({page, pageSize}) {
    const orderList = await this.model("pcb_order").where({create_by: think.user.uid}).page(page, pageSize).order("id DESC").countSelect()
    return orderList
  }

  processQueryData (obj) {
    obj.order_no = `E${_.get(enums.enquire_type, obj.type)}${_.toString(obj.create_time).slice(0, -3)}${_.padStart(obj.id, 6, 0)}`
    obj._create_time = moment(_.toNumber(obj.create_time)).format('YYYY-MM-DD HH:mm:ss')
    obj._status = _.get(enums, `status.${obj.status}`)

    return obj
  }
}