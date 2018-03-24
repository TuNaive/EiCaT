import Frontend from '../common/frontend'

export default class extends Frontend {
  __before(needLogin = false) {
    return super.__before(needLogin).then(data => {
      this.meta_title = this.__.jed.dgettext('common', 'aboutus')
      return data
    })
  }

  constructor (ctx) {
    super(ctx)
    this.active = [ '/aboutus' ]
  }
}
