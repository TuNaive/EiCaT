import Base from './base'

export default class extends Base{
  indexAction() {
    this.meta_title = '首页'
    this.active = ['/', '/index', '/index.html']
    return this.display()
  }
}
