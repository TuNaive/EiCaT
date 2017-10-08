import Base from './base.js'

export default class extends Base {
  async loginAction() {
    if (this.isPost) {
      const geetest = this.service('external/geetest')
      const captchaRes = await geetest.validate(this.ctx, this.post())

      showDebug(`captcha validate result is: ${JSON.stringify(captchaRes)}`)
      if (captchaRes.status !== 'success') {
        return this.fail(-3, '智能验证错误!')
      }

      const username = this.post('username')
      const password = encryptPassword(this.post('password'))
      showDebug(`trying to login with username: ${username} and password: ${password}`)
    } else if (this.isLoggedIn) {
        this.redirect('/account/index')
    } else {
      return this.display()
    }
  }
}
