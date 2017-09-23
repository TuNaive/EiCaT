import Base from './base.js'

export default class extends Base {
  indexAction() {
    this.meta_title = 'PCB服务'
    this.active = ['/pcbs', '/pcbs.html']
    this.channel = 'PCB/SMT'
    return this.display()
  }
}
