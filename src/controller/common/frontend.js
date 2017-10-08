export default class Frontend extends think.Controller {
  async __before() {
    this.setLocal()
    this.isLoggedIn = await this.isLoggedIn()
  }

  setLocal() {
    let locale = this.get('locale')
    if (locale && !_.isEqual(this.cookie('locale'), locale)) {
      this.cookie('locale', locale)
      this.assign('__', this.getI18n(locale))
    }
    this.assign('isZh', !_.isEqual(this.cookie('locale'), 'en-us'))
  }

  async isLoggedIn() {
    const user = await this.session('webuser')
    return think.isEmpty(user) ? false : user.uid
  }
}
