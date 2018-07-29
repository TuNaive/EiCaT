export default class extends think.Controller {
  async __before(needLogin = false, alertLogin = false) {
    console.log(needLogin, alertLogin, this.ctx)
    // 当前登录状态
    this.is_login = this.isLoggedIn = await this.isLogin();
    if (needLogin && !this.isLoggedIn && _.indexOf(['/', '/index', '/account/auth/login', '/account/auth/register'], this.ctx.path) === -1) {
      // 去登录
      if (alertLogin) {
        this.redirect(`${this.ctx.header.referer.split('?')[0]}?login=true`);
      } else {
        this.controller('common/error').noAction('请登录！');
      }
      
      return false;
    }
    // 用户信息
    this.user = await this.session('webuser')
  }

  indexAction () {
    return this.display()
  }
  
  async isLogin () {
    const user = await this.session('webuser');
    const res = _.isObject(user) ? user.uid : false;
    return res;
  }

  async weblogin() {
    // todo: delete
    const isLogin = await this.isLogin();
    if (!isLogin) {
      // 跳转到登录页面
      this.controller('common/error').noAction('请登录！');
      return false;
      // return this.redirect('/accout/login');
    }
  }
}
