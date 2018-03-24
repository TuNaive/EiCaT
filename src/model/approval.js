export default class extends think.Model {
  /**
   * 添加审核
   * @param model
   * @param uid
   * @param title
   * @param data
   * @returns {Promise}
   */
  async adds(model, uid, title, data, model_id) {
    let res = await this.add({
      model: model,
      model_id: model_id,
      uid: uid,
      title: title,
      data: JSON.stringify(data),
      time: new Date().getTime()
    });
    return res;
  }
}