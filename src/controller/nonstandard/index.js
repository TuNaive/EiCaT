import Base from './base.js'
import fs from 'mz/fs'

export default class extends Base {
  constructor(ctx) {
    super(ctx)
  }
  __before() {
    return super.__before(true, true).then(data => {
      return data
    })
  }
  async indexAction() {
    this.sub_channel = '非标定制配单'
    const user = await this.session('webuser')
    this.assign('type', '3')
    this.assign('user', user)
    this.assign('goods_id', this.get('goods_id'))
    return this.display();
  }
  async createEnquireAction() {
    const postParams = this.post()

    postParams.user_id = this.user.uid
    postParams.order_no = this.model('nonstandard_enquire').getOrderid(this.user.uid)

    await this.model('nonstandard_enquire').add(postParams)

    return this.success()
  }
}
