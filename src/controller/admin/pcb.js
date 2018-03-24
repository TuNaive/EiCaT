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
    // auto render template file index_index.html
    let list = await this.model('pcb_price').select();
    list = _.map(list, obj => {
      obj = _.omitBy(obj, _.isNil)

      return obj
    })
    list = _.groupBy(list, obj => obj.option)

    this.assign('list', list);
    this.meta_title = 'PCB报价管理';
    return this.display();
  }

  /**
   * update action
   * @return {Promise} []
   */
  async updateAction() {
    const data = this.post()
    const updateData = []

    _.forEach(data, (val, key) => {
      if (_.startsWith(key, 'id')) {
        updateData.push({
          id: val,
          price: data[`price-${val}`]
        })
      }
    })

    let res = await this.model("pcb_price").updateMany(updateData);
    if (res) {
      return this.success({name: "更新成功！"});
    } else {
      return this.fail("更新失败！");
    }
  }

  getPriceLabel (val) {
    return pcbEnums.pcbFee[`${val}Fee`] + ' = ' + pcbEnums.pcbFeeRule[`${val}Fee`]
  }

  getPriceOption (val) {
    return pcbEnums.pcbCustomOptions[val]
  }
};
