import Frontend from '../common/frontend'

export default class extends Frontend {
  __before(needLogin = false, alertLogin = false) {
    return super.__before.apply(this, arguments).then(data => {
      this.meta_title = this.__.jed.dgettext('common', '非标定制')
      this.active = ['/fabric']
      this.channel = 'Non-Standard'
      this.$locale = _.get(this.getLocale(), '0')
      return data
    })
  }
}
