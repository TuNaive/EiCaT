const enums = {
  status: { // 询价单状态
    '0': '等待回复',
    '1': '已回复',
    '-1': '已取消'
  }
}

export default class extends think.Model {
  beforeAdd (data) {
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

  getOrderid(uid) {
    // 用户id+毫秒时间戳后5位
    const m = new Date().getTime().toString();
    return 'E' + _.padEnd(uid, 10, '0') + m.substr(8);
  }

  processQueryData (obj) {
    obj._create_time = moment(_.toNumber(obj.create_time)).format('YYYY-MM-DD HH:mm:ss')
    obj._status = _.get(enums, `status.${obj.status}`)

    return obj
  }
}