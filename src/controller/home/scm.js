import Base from './base'

export default class extends Base {
  indexAction() {
    this.meta_title = this.__.jed.dgettext('common', 'home')
    this.active = ['/scm', '/scm.html']
    return this.display()
  }
}
