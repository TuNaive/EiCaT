module.exports = class extends think.Model {
  async getCachedChannels () {
      return await think.cache('channels',() => this.getChannels(), { timeout: 365 * 24 * 3600 })
  }

  async getChannels () {
    const channels = await this.where({ status: 1 }).order('sort ASC').select()
    return channels
  }
}