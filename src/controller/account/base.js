import User from '../common/user.js'

export default class extends User {
  __before() {
    this.meta_title = '个人中心'
    return super.__before().then(data => {
    	return data
    })
  }

  indexAction () {
    return this.display()
  }
}
