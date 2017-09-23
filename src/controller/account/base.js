export default class extends think.Controller {
  __before() {
  }

  async isLogin () {
    const user = await this.session('')
  }
}
