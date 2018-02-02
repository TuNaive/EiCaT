import User from '../common/user.js'

export default class extends User {
  __before(needLogin = true) {
    this.meta_title = '个人中心'
    return super.__before(needLogin).then(data => {
    	return data
    })
  }

  indexAction () {
    return this.display()
  }
}
