import Base from './base.js'
import fs from 'fs'

export default class extends Base {
  /**
   * index action
   * 用户中心主页
   * @return {Promise} []
   */
  async indexAction() {
    //订单交易总金额
    let order = await this.model("order").where({user_id: this.user.uid, pay_status: 1}).getField('order_amount');
    let orderTotal = eval(order.join("+"));
    this.assign("orderTotal", orderTotal);
    //进行中的订单
    let onOrder = await this.model("order").where({status: ['IN', '2, 3'], user_id: this.user.uid}).count("id");
    this.assign("onOrder", onOrder);
    //带评价的商品 TODO
    this.meta_title = "用户中心";

    return this.display();
  }

  //获取头像
  async avatarAction() {
    let uid = this.get("uid")||this.user.uid
    var uploadPath = think.resource + '/upload/avatar/' + uid;
    let path = think.isFile(uploadPath + "/" + "/avatar.png");
    let pic;
    if (path) {
      pic = fs.readFileSync(uploadPath + "/" + "/avatar.png")
    } else {
      pic = fs.readFileSync(think.resource + '/upload/avatar/avatar.jpg')
    }
    this.header('Content-Type', 'image/png');
    return this.body=pic;
  }
}
