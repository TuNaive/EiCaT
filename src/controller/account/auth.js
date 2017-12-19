import Base from './base.js'

export default class extends Base {
  /**
   * 注册页面
   */
  async registerAction() {
    this.channel = '注册'
    if (this.isPost) {
      const data = this.post();
      // console.log(data);
      // 验证
      let res;
      if (think.isEmpty(data.username)) {
        return this.fail('用户昵称不能为空！');
      } else {
        res = await this.model('member').where({username: _.trim(data.username)}).find();
        if (!think.isEmpty(res)) {
          return this.fail('用户昵称已存在，请重新填写！');
        }
      }
      if (think.isEmpty(data.mobile)) {
        return this.fail('手机号码不能为空！');
      } else {
        res = await this.model('member').where({mobile: data.mobile}).find();
        if (!think.isEmpty(res)) {
          return this.fail('手机号码已存在，请重新填写！');
        }
      }
      if (think.isEmpty(data.email)) {
        return this.fail('电子邮箱不能为空！');
      } else {
        res = await this.model('member').where({email: data.email}).find();
        if (!think.isEmpty(res)) {
          return this.fail('电子邮箱已存在，请重新填写！');
        }
      }
      if (think.isEmpty(data.password) && think.isEmpty(data.password2)) {
        return this.fail('密码不能为空！');
      } else {
        if (data.password != data.password2) {
          return this.fail('两次输入的密码不一致，请重新填写！');
        }
      }
      if (data.clause != 'on') {
        return this.fail('必须要同意,网站服务条款');
      }

      data.status = 1;
      data.reg_time = new Date().valueOf();
      data.reg_ip = _ip2int(this.ip);
      data.password = encryptPassword(data.password);
      const reg = await this.model('member').add(data);
      await this.model('member').autoLogin({id: reg}, this.ip);// 更新用户登录信息，自动登陆
      const userInfo = {
        'uid': reg,
        'username': data.username,
        'last_login_time': data.reg_time
      };
      await this.session('webuser', userInfo);
      return this.success({name: '注册成功,登录中!', url: '/account/index'});
    } else {
      this.meta_title = '用户注册';
      return this.display();
    }
  }
  /**
   * 登录页面
   */
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
      const res = await this.model('member').signin(username, password, this.ip, 5, 0);
      if (res.uid > 0) {
        // 记录用户登录行为
        // await this.model("action").log("user_login", "member", res.uid, res.uid, this.ip(), this.http.url);
        await this.session('webuser', res);
        // TODO 用户密钥
        return this.success({name: '登录成功！'});
      } else { // 登录失败
        let fail;
        switch (res) {
          case -1:
            fail = '用户不存在或被禁用';
            break; // 系统级别禁用
          case -2:
            fail = '密码错误';
            break;
          default:
            fail = '未知错误';
            break; // 0-接口参数错误（调试阶段使用）
        }
        return this.fail(res, fail);
      }
    } else if (this.isLoggedIn) {
        this.redirect('/account/index')
    } else {
      return this.display()
    }
  }
  // 退出登录
  async logoutAction() {
    // 退出登录
    if (this.isLoggedIn) {
      await this.session('webuser', null);
      // cysoIp9AH
      return this.display();
    } else {
      return this.redirect('/index');
    }
  }
}
