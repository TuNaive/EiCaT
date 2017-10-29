export default class extends think.Model {
  async getCachedPrice (filters) {
    // return await think.cache('pcb_pice',() => this.getPrice(filters), { timeout: 1 * 3600 })
    return await think.cache('pcb_pice', () => this.getPrice(filters), { timeout: 0 })
  }

  async getPrice (filters) {
    const fields = {
      boardLayer: null,
      boardMaterial: null,
      boardThickness: null,
      aluminumOutThickness: null,
      aluminumInThickness: null,
      makeupNum: null,
      surfacing: null,
      solderMaskColor: null,
      charColor: null,
      minLineSpace: null,
      minAperture: null,
      holeAmount: null,
      halfHole: null,
      testMethod: null,
      urgent: null,
      option: null
    }
    const priceRecord = await this.where(_.merge({}, fields, filters)).find()
    return priceRecord.price || 0
  }
}