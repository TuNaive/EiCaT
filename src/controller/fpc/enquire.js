
import Base from './base.js'

export default class extends Base {
  /**
   * FPC定制单管理
   */
  async fpcAction() {
    //判断是否登陆
    // await this.weblogin();

    let status = this.para("status") || null;

    let map = {
      user_id: this.user.uid,
      status: ["!=", -1]

    }

    //当前位置
    if (!think.isEmpty(status)) {
      this.assign('status', status);
    }

    //筛选订单
    if (status == -1) {
      map.status = -1
    }

    let data = await this.model("bom_enquire").where(map).page(this.para('page')).order("create_time DESC").countSelect();
    let html = this.pagination(data);

    this.assign('pagination', html);

    this.assign("count",data.count);
    this.assign('list', data.data);
    this.meta_title = "我的订单";

    return this.display();
  }

  /**
   * fpc定制单详情
   * @returns {PreventPromise}
   */
  async fpcDetailAction() {
    let data = await this.model("bom_enquire").where({
      id: this.para('id')
    }).find();

    this.assign('data', data);
    this.meta_title = "定制单详情";

    return this.display();
  }

  //删除询价单
  async deleteAction() {
    //判断是否登陆
    // await this.weblogin();

    const map = {
      id: this.get("id"),
      user_id: this.user.uid
    }
    const res = await this.model("bom_enquire").where(map).update({status: -1});

    if (res) {
      return this.success({name: "删除成功！"});
    } else {
      return this.fail("删除失败!");
    }
  }
}