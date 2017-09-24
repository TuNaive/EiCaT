import Base from './base.js'

export default class extends Base {
  calcAction() {
    this.sub_channel = 'PCBA自助询价'
    return this.display()
  }

  enquireAction() {
    this.sub_channel = 'PCBA工程师人工询价'
    return this.display()
  }
}
