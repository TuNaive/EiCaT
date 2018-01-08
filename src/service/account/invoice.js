
export default class extends think.Service {
  constructor () {
    super()
  }

  async getInvoiceList(ctrl, {page = ctrl.get('page'), pageSize = ctrl.get('pageSize')}) {
    let data = await this.model("invoice").where({userId: ctrl.user.uid}).page(page, pageSize).order("isDefault DESC,id DESC").countSelect();
    
    let html = ctrl.pagination(data);

    ctrl.assign('pagination', html);

    return data
  }

  async getNorInvoiceList(ctrl, {page = ctrl.get('page') || 1, pageSize = ctrl.get('pageSize') || 5}) {
    const res = await ctrl.model('invoice').where({ userId: ctrl.user.uid }).page(page, pageSize).order("isDefault DESC,id DESC").countSelect()
    let html = ctrl.pagination(res)
    ctrl.assign('pagination', html)
    _.forEach(res.data, (value, key) => {
      if (_.isEqual(value.raceType, 0)) {
        value.invoiceTitle = '个人'
      }
    })
    ctrl.assign('listNormal', res.data)
  }

  async getSpeInvoiceList(ctrl, {page = ctrl.get('page') || 1, pageSize = ctrl.get('pageSize') || 2}) {
    const specialRes = await ctrl.model('invoice').where({ userId: ctrl.user.uid, invoiceType: 1 }).order("isDefault DESC,id DESC").page(page, pageSize).countSelect()
    let htmlSpecial = ctrl.pagination(specialRes)
    ctrl.assign('paginationSpecial', htmlSpecial)
    ctrl.assign('listSpecial', specialRes.data)
  }

}
