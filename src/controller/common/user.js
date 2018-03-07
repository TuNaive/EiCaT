export default class extends think.Controller {
  async __before(needLogin = false) {
    // 当前登录状态
    this.is_login = this.isLoggedIn = await this.isLogin();
    if (needLogin && !this.isLoggedIn && _.indexOf(['/', '/index', '/account/auth/login', '/account/auth/register'], this.ctx.path) === -1) {
      // 跳转到登录页面
      this.redirect('/?login=true');
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
      return this.redirect('/accout/login');
    }
  }
}
