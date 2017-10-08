export default class extends think.Controller {
  async getCaptchaAction () {
    const geetest = this.service('external/geetest')
    if (this.isPost) {
      const post = this.post()
      const res = await geetest.validate(this.ctx, post)
      return this.json(res)
    } else {
      const res = await geetest.register(this.ctx)
      return this.json(res)
    }
  }
}
