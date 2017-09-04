import Base from './base.js'

export default class extends Base {
  indexAction() {
    console.log('test')
    return this.display()
  }
}
