import Frontend from '../common/frontend'

export default class extends Frontend {
  __before(needLogin = true) {
    this.meta_title = '个人中心'
    return super.__before(needLogin).then(data => {
      return data
    })
  }
}
