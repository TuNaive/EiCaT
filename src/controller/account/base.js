export default class extends think.Controller {
  constructor(ctx) {
    super(ctx)
    this.user = think.user
  }

  __before() {
    this.meta_title = '个人中心'
  }

  indexAction () {
    return this.display()
  }

  async isLogin () {
    const user = await this.session('')
  }
}
