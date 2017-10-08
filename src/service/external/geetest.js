import Gt3 from 'gt3-sdk'

export default class extends think.Service {
  constructor(ctx) {
    super(ctx)
    this.captcha = new Gt3({
      geetest_id: '7fb76a404f5b3ec0985f8f1dff5d3c81', //think.config('settings.geetest.id'),
      geetest_key: 'a59ab929c9854b467996f5ca4e137702', //think.config('settings.geetest.key')
    })
  }

  async register(ctx, type) {
    // 初始
    const captchaRegister = new Promise((resolve, reject) => {
      console.log(this.captcha)
      this.captcha.register(null, (err, data) => {
        if (err) {
          reject(err)
        }

        if (!data.success) {
          ctx.session('fallback', 1)
        } else {
          ctx.session('fallback', 0)
        }
        resolve(data)
      })
    })

    return await captchaRegister
  }

  async validate(ctx, data) {
    let fallback = !!(await ctx.session('fallback'))
    let validateData = {
      geetest_challenge: data.geetest_challenge,
      geetest_validate: data.geetest_validate,
      geetest_seccode: data.geetest_seccode
    }
    // console.log('captcha fallback:', fallback)
    // 验证
    const captchaValidate = new Promise((resolve, reject) => {
      this.captcha.validate(fallback, validateData, (err, success) => {
        // console.log(err)
        let res = {}
        if (err) {
          // 网络错误
          res = { status: 'error', info: err }
        } else if (!success) {
          // 二次验证失败
          res = { status: 'fail', info: '登录失败' }
        } else {
          res = { status: 'success', info: '登录成功' }
        }
        resolve(res)
      })
    })

    return await captchaValidate
  }
}
