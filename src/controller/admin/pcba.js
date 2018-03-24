import Admin from '../inc/admin'
import { pcbEnums } from '../pcbsvr/enums.js'

module.exports = class extends Admin {
  constructor(ctx) {
    super(ctx); // 调用父级的 constructor 方法，并把 ctx 传递进去
    this.tactive = 'content';
  }

  /**
   * index action
   * @return {Promise} []
   */
  async indexAction() {
    let price = await this.model('pcba_price').where({id: 1}).find();
    this.meta_title = 'PCBA报价管理';
    const quoties = this.getQuotie()
    this.assign('quoties', quoties)
    this.assign('price', price)
    return this.display();
  }

  /**
   * update action
   * @return {Promise} []
   */
  async updateAction() {
    const data = this.post()
    let res = await this.model("pcba_price").where({id: 1}).update(data);
    if (res) {
      return this.success({name: "更新成功！"});
    } else {
      return this.fail("更新失败！");
    }
  }

  getQuotie () {
    return pcbEnums.pcbaFeeQuotie.quotie
  }
};

