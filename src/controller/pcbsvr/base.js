import Frontend from '../common/frontend.js'

export default class Base extends Frontend {
  __before(needLogin) {
    return super.__before(needLogin).then(data => {
      this.meta_title = 'PCB服务'
      this.active = ['/pcbsvr', '/pcbsvr.html']
      this.channel = 'PCB/PCBA'
      this.$locale = _.get(this.getLocale(), '0')
      return data
    })
  }
}