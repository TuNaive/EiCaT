import Frontend from '../common/frontend.js'

export default class extends Frontend {
  indexAction() {
    this.meta_title = '首页'
    this.active = ['/', '/index', '/index.html']
    return this.display()
  }
}
