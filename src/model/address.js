export default class extends think.Model {
  async getAddress(addressId) {
    const resAddr = {}
    let address = await this.where({id: addressId}).find()

    resAddr.address = _.merge(address, {
      // todo: 整合时加_
      _province: await this.model("area").where({id: address.province}).getField("name", true),
      _city: await this.model("area").where({id: address.city}).getField("name", true),
      _county: await this.model("area").where({id: address.county}).getField("name", true)
    })

    return resAddr
  }
}