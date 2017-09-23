export default class extends think.Model {
  async getBannerById(id) {
    let banners = await think.cache('banners', () => this.select(), { timeout: 365 * 24 * 3600 })
    return _.filter(banners, { id: _.toNumber(id) })
  }

  async getCachedBanners(limit) {
    return await think.cache('banners',() => this.getBanners(limit), { timeout: 365 * 24 * 3600 })
  }

  async getBanners(limit = 10) {
    const banners = await this.where({ status: 1 }).limit(limit).order('sort ASC').select()
    return banners
  }
}
