import Base from './base.js'

export default class extends Base {
  calcAction() {
    this.sub_channel = 'PCB自助询价'
    return this.display()
  }

  enquireAction() {
    this.sub_channel = 'PCB工程师人工询价'
    return this.display()
  }

  calculateAction() {
    this.body = this.post()
  }

  uploadAction() {
    showDebug('==============')
    this.body = 'test'
  }
}
