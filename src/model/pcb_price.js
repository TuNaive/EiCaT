export default class extends think.Model {
  async getCachedPrice (filters) {
    return await think.cache('pcb_pice',() => this.getPrice(filters), { timeout: 365 * 24 * 3600 })
  }

  async getPrice (filters) {
    const priceRecord = await this.where(filters).find()
    return priceRecord
  }
}