import User from './user.js'

export default class Access extends User {
  __before () {
    return super.__before(true).then(data => {
      return data
    })
  }

  /*
  * 访问控制
  * */
  async accessCtrl (cateId) {
    /*let roleid = 8;//游客
    if (this.is_login) {
      roleid = await this.model("member").where({id: this.is_login}).getField('groupid', true);
    }
    let priv = await this.model("category_priv").priv(cateId, roleid, 'visit');
    if (!priv) {
      const error = this.controller('common/error');
      return error.noAction('您所在的用户组,禁止访问本栏目！')
    }*/
  }
}