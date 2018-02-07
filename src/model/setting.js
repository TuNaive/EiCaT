const isEnum = type => {
  return type === 3
}

export default class extends think.Model {
  /**
   * 初始化和设置网站配置
   * @returns 
   */
  async initSettings () {
    // TODO: 暂时去掉缓存
    // return await think.cache('settings', () => this.getSettings(), { timeout: 365 * 24 * 3600 })
    return await this.getSettings()
  }

  /**
   * 获取网站配置
   * @returns 
   */
  async getSettings () {
    const settings = {}
    const records = await this.where({ status: 1 }).order('sort ASC').field(['key', 'value', 'type']).select()

    records.forEach(record => {
      // 枚举型配置字符串转对象
      if (record.value.search(/\r\n/ig) > -1 && isEnum(record.type)) {
        let vals = record.value.split('\r\n')
        record.value = {}
        vals.forEach(val => {
          val = val.split(':')
          record.value[val[0]] = val[1]
        })
      }
      settings[record.key] = record.value
    })
    
    return settings
  }
}
