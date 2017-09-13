export default class extends think.Model {
  async getBannerById(id) {
    let banners = await think.cache('banners', () => this.select(), { timeout: 365 * 24 * 3600 })
    return _.filter(banners, { id: _.toNumber(id) })
  }
}
