import Base from './base.js'
import fs from 'mz/fs'

export default class extends Base {
  constructor(ctx) {
    super(ctx)
    this.uploadPath = think.ROOT_PATH + '/uploadFiles'
  }

  __before() {
    return super.__before(true).then(data => {
      return data
    })
  }

  async createEnquireAction() {
    const postParams = this.post()

    postParams.user_id = this.user.uid
    postParams.order_no = this.model('nonstandard_enquire').getOrderid(this.user.uid)
    postParams.goods_id = parseInt(postParams.goods_id)

    await this.model('nonstandard_enquire').add(postParams)

    return this.success()
  }
}
