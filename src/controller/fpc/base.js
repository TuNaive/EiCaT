import Frontend from '../common/frontend'

export default class extends Frontend {
  __before(needLogin = false, alertLogin = false) {
    return super.__before.apply(this, arguments).then(data => {
      this.meta_title = this.__.jed.dgettext('common', 'fpc')
      this.active = ['/fpc']
      this.channel = 'FPC'
      this.$locale = _.get(this.getLocale(), '0')
      return data
    })
  }
}
