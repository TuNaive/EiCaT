import User from './user.js'

export default class Frontend extends User {
  __before() {
    this.setLocal()
    return super.__before().then(data => {
      return data
    })
  }

  setLocal() {
    let locale = this.get('locale')
    if (locale && !_.isEqual(this.cookie('locale'), locale)) {
      this.cookie('locale', locale)
      this.assign('__', this.getI18n(locale))
    }
    this.assign('isZh', !_.isEqual(this.cookie('locale'), 'en-us'))
  }
}
