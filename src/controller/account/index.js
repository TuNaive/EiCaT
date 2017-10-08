import Base from './base.js'

export default class extends Base {
  loginAction() {
    if (this.isPost) {

    } else if (this.is_login) {
        this.redirect('/center/index');
      }{
      return this.display()
    }
  }
}
