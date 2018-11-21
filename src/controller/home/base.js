import Frontend from '../common/frontend'

export default class extends Frontend {
  __before(needLogin = false) {
    this.meta_title = '增值服务'
    return super.__before(needLogin).then(data => {
      return data
    })
  }

  constructor (ctx) {
    super(ctx)
  }
}
