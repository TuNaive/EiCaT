import Base from './base'

export default class extends Base {
  indexAction() {
    this.meta_title = this.$i18n.jed.dgettext('common', 'aboutus')
    this.active = [ '/aboutus', '/aboutus.html']
    return this.display()
  }
}
