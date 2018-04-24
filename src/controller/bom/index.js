import Base from './base.js'
import fs from 'mz/fs'

export default class extends Base {
  constructor(ctx) {
    super(ctx)
    this.uploadPath = think.ROOT_PATH + '/uploadFiles'
  }

  __before() {
    return super.__before(true, true).then(data => {
      return data
    })
  }
  async indexAction() {
    this.sub_channel = 'BOM配单'
    const user = await this.session('webuser')
    this.assign('type', '2')
    this.assign('user', user)
    return this.display();
  }
  async createEnquireAction() {
    const postParams = this.post()

    postParams.user_id = this.user.uid
    postParams.order_no = this.model('bom_enquire').getOrderid(this.user.uid)

    await this.model('bom_enquire').add(postParams)

    return this.success()
  }
}
