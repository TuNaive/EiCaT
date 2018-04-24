import Frontend from '../common/frontend'

export default class extends Frontend {
  __before(needLogin = false) {
    return super.__before.apply(this, arguments).then(data => {
      this.meta_title = this.__.jed.dgettext('common', 'bom')
      this.active = ['/bom', '/bom.html']
      this.channel = 'BOM'
      this.$locale = _.get(this.getLocale(), '0')
      return data
    })
  }
}
