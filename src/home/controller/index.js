import Base from './base.js'

export default class extends Base {
  indexAction() {
    this.meta_title = '首页'
    return this.display()
  }
}
