import Frontend from '../common/frontend.js'

export default class Base extends Frontend {
  __before() {
    super.__before()
    this.meta_title = 'PCB服务'
    this.active = ['/pcbsvr', '/pcbsvr.html']
    this.channel = 'PCB/SMT'
  }

  async isLogin () {
    const user = await this.session('')
  }
}