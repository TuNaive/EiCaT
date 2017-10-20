export default class extends think.Model {
  async getFiles () {
    const fileUuids = await this.getField('fileUuid')
    return fileUuids
  }
}