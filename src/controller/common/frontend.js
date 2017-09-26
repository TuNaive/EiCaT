export default class Frontend extends think.Controller {
  __before() {
    this.setlocal()
  }

  setlocal() {
    let locale = this.get('locale')
    if (locale && !_.isEqual(this.cookie('locale'), locale)) {
      this.cookie('locale', locale)
      this.assign('__', this.getI18n(locale))
    }
    this.assign('isZh', !_.isEqual(this.cookie('locale'), 'en-us'))
  }

  async isLogin () {
    const user = await this.session('')
  }
}
