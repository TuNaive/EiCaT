import Admin from '../cmswing/admin'
import Fs from 'fs'

module.exports = class extends Admin {
  constructor(ctx) {
    super(ctx); // 调用父级的 constructor 方法，并把 ctx 传递进去
    // 其他额外的操作
    this.tactive = "ecom"
  }

  /**
   * index action
   * @return {Promise} []
   */
  indexAction() {
    //auto render template file index_index.html
    return this.display();
  }

  /**
   * ping++支付
   */
  async pingxxAction() {
    //获取app_id
    let app_id = this.config("settings.PINGXX_APP_ID");
    let livesecretkey = this.config("settings.PINGXX_LIVE_SECRET_KEY");
    const online = await this.config('settings.PAY_ONLINE')
    this.assign("app_id", app_id);
    this.assign("livesecretkey", livesecretkey);
    this.assign("online", online);
    //获取支付渠道
    let channel = await this.model('pingxx').order('sort ASC').select();
    //console.log(channel);
    this.assign("channel", channel);
    this.meta_title = "支付设置";
    return this.display();
  }

  async saveOnlineAction() {
    let post = this.post() || {};
    if (!_.isNil(post.online)) {
      await this.model('setting').where({key: 'PAY_ONLINE'}).update({value: post.online});
      await think.cache("settings", null);
      // 重启时间无法保证，同步 settings 数据
      await this.config('settings.PAY_ONLINE', post.online);
      // process.send('think-cluster-reload-workers'); // 给主进程发送重启的指令
    }
    this.success('saveOnline success')
  }

  // 添加appid
  async addappidAction() {
    if (this.isAjax("POST")) {
      let appid = this.post('appid');
      let res = await this.model("settings").where({name: 'PINGXX_APP_ID'}).update({value: appid});
      if (res) {
        await this.cache("settings", null);
        process.send('think-cluster-reload-workers'); // 给主进程发送重启的指令
        return this.success({name: "设置成功！"});
      } else {
        return this.fail("设置失败！");
      }
    } else {
      this.meta_title = "添加App_ID";
      return this.display();
    }
  }

  async addlivesecretkeyAction() {
    if (this.isAjax("POST")) {
      let appid = this.post('livesecretkey');
      let res = await this.model("settings").where({name: 'PINGXX_LIVE_SECRET_KEY'}).update({value: appid});
      if (res) {
        await this.cache("settings", null);
        process.send('think-cluster-reload-workers'); // 给主进程发送重启的指令
        return this.success({name: "设置成功！"});
      } else {
        return this.fail("设置失败！");
      }
    } else {
      this.meta_title = "添加Live Secret Key";
      return this.display();
    }
  }

  //配置商户私钥
  rsaAction() {
    let type = this.para("type");
    //console.log(type);
    let path;
    switch (type) {
      case "private":
        path = think.ROOT_PATH + "/private/pingpp/cmswing_rsa_private_key.pem";
        break;
      default:
        path = think.ROOT_PATH + "/private/pingpp/pingpp_rsa_public_key.pem";

    }
    //console.log(path);
    if (this.isAjax("POST")) {
      let rsa = this.post("rsa");
      //console.log(path);
      //return false;
      if (type == "private") {
        //console.log(rsa);
        Fs.writeFileSync(path, rsa, 'utf8');
        return this.success({name: "设置成功！"});
      } else {
        Fs.writeFileSync(path, rsa, 'utf8');
        return this.success({name: "设置成功！"});
      }
    } else {
      if (type == "private") {
        let rsa = Fs.readFileSync(path, null);
        this.assign("rsa", rsa);
        this.meta_title = "配置商户私钥";
      } else {
        let rsa = Fs.readFileSync(path, null);
        this.assign("rsa", rsa);
        this.meta_title = "Ping++ 公钥";
      }
      this.assign("type", type);
      return this.display();
    }

  }

  //Webhooks
  async webhokksAction() {

    let config = [
      {name: "支付成功", url: `${this.ctx.host}/center/pay/webhooks`}
    ]
    this.assign("list", config);
    this.meta_title = "Webhooks";
    return this.display();
  }

  /**
   * 正在使用的支付方式
   */
  async paymentAction() {
    this.meta_title = "正在使用的支付方式";
    let data = await this.model("payment").page(this.get('page')).countSelect();
    let Pages = think.adapter("pages", "page"); //加载名为 dot 的 Template Adapter
    let pages = new Pages(this.http); //实例化 Adapter
    let page = pages.pages(data);
    for (let val of data.data) {
      val.logo = await this.model("pay_plugin").where({id: val.plugin_id}).getField("logo", true);
    }
    this.assign('pagerData', page); //分页展示使用
    this.assign('list', data.data);
    return this.display();
  }

  /**编辑支付方式 */
  async editpayAction() {
    if (this.isAjax("POST")) {
      let data = this.post();
      let res = await this.model("payment").update(data);
      if (res) {
        return this.success({name: '编辑支付方式成功！', url: "/admin/ecom/payment"});
      } else {
        return this.fail('编辑支付方式失败！');

      }
    } else {
      let id = this.get("id");
      let info = await this.model("payment").find(id);
      this.assign("info", info);
      this.meta_title = "配置支付方式";
      return this.display();
    }
  }

  /**添加支付方式 */
  async addpayAction() {
    if (this.isAjax("POST")) {
      let data = this.post();
      let res = await this.model("payment").add(data);
      if (res) {
        return this.success({name: '添加支付方式成功！', url: "/admin/ecom/payment"});
      } else {
        return this.fail('添加支付方式失败！');

      }
    } else {
      let id = this.get("id");
      let info = await this.model("pay_plugin").find(id);
      this.assign("info", info);
      this.meta_title = "添加支付方式";
      return this.display();
    }

  }

  /**删除正在使用的支付方式 */
  async delpayAction() {
    let id = this.get("id");
    let res = await this.model("payment").where({id: id}).delete();
    if (!think.isEmpty(res)) {
      return this.success({name: '删除成功！'});

    } else {
      return this.fail('删除失败！');

    }
  }

  /**支付插件 */

  async paypluginAction() {
    this.meta_title = "全部支付方式";
    // this.end(11);
    this.active = "admin/ecom/payment";
    let data = await this.model("pay_plugin").page(this.get('page')).countSelect();
    let html = this.pagination(data);
    this.assign('pagerData', html); //分页展示使用
    this.assign('list', data.data);
    return this.display();
  }

  /**运费模板 */
  async fareAction() {
    this.meta_title = "运费模板";
    let list = await this.model("fare").page(this.get('page')).order("is_default DESC").countSelect();
    let html = this.pagination(list);
    //console.log(list);
    this.assign('pagerData', html); //分页展示使用
    this.assign('list', list.data);
    return this.display();
  }

  /**
   * 添加运费模板
   */

  async addfareAction() {
    if (this.isAjax("POST")) {
      let data = this.post();
      let res = await this.model('fare').add(data);
      if (res) {
        return this.success({name: "添加运费模板成功！", url: "/admin/ecom/fare"})
      } else {
        return this.fail("添加运费模板失败！")
      }
    } else {
      this.meta_title = "添加运费模板";
      this.active = "admin/ecom/fare";
      return this.display();
    }

  }

  //编辑运费模板
  async editfareAction() {
    if (this.isAjax("POST")) {
      let data = this.post();
      let res = await this.model("fare").update(data);
      if (res) {
        return this.success({name: "编辑运费模板成功！", url: "/admin/ecom/fare"})
      } else {
        return this.fail("编辑运费模板失败！")
      }
    } else {
      let id = this.get('id');
      if (!think.isNumberString(id)) {
        return this.fail("哦也！")
      }
      let res = await this.model("fare").find(id);
      if (res) {
        this.assign("info", res);
      } else {
        return this.fail("您选择的运费模板已经被删除！")
      }
      this.meta_title = "编辑运费模板";
      this.active = "admin/ecom/fare";
      return this.display();
    }
  }

  //设置默认使用的模板
  async defaulffareAction() {
    let id = this.get("id");
    await this.model('fare').where("1=1").update({is_default: 0});
    let update = await this.model("fare").where({id: id}).update({is_default: 1});
    if (update) {
      return this.success({name: "设置成功！"})
    } else {
      return this.fail("设置失败！")
    }
  }

  //删除运费模板
  async delfareAction() {
    let id = this.get("id");
    let res = await this.model("fare").where({id: id}).delete();
    if (res) {
      return this.success({name: "删除模板成功！"})
    } else {
      return this.fail("删除模板失败！")
    }
  }

  /**
   * 选择配送地区
   */
  async fareareaAction() {
    if (this.isAjax("POST")) {
      let data = await this.model("area").field("id,name,parent_id as pid,sort").select();
      data = arr_to_tree(data, 0);
      //for(let val of data){
      //    val.pId =val.pid;
      //}
      return this.json(data);
    } else {
      this.assign('id', this.get("id"));
      this.meta_title = "选择配送地区";
      return this.display();
    }

  }

  /**快递公司管理 */
  async expressAction() {
    let data = await this.model("express_company").page(this.get('page'), 10).countSelect();
    let html = this.pagination(data);
    this.assign('pagerData', html); //分页展示使用
    this.assign('list', data.data);
    this.meta_title = "快递公司管理";
    this.active = "admin/ecom/express"
    return this.display();
  }

  /**
   * 新增快递公司
   */
  async addexpressAction() {
    if (this.isPost) {
      let data = this.post();
      let res = await this.model('express_company').add(data);
      if (res) {
        return this.success({name: "添加成功!"});
      } else {
        return this.fail("添加失败!")
      }
    }
    else {
      this.meta_title = "添加快递公司";
      return this.display();
    }


  }

  /**
   * 编辑快递公司
   * @returns {Promise.<void>}
   */
  async editexpressAction() {
    if (this.isPost) {
      let data = this.post();
      let res = await this.model("express_company").update(data);
      if (res) {
        return this.success({name: "更新成功!"});
      } else {
        return this.fail("更新失败!")
      }
    } else {
      let id = this.get("id");
      let info = await this.model("express_company").find(id);
      this.assign("info", info);
      this.meta_title = "编辑快递公司";
      return this.display();
    }
  }

  /**
   * 删除快递公司
   * @returns {Promise.<void>}
   */
  async delexpressAction() {
    let ids = this.para("ids");
    if (think.isEmpty(ids)) {
      return this.fail('请选择要删除的数据!')
    }
    let res = await this.model("express_company").where({id: ['IN', ids]}).delete();
    if (res) {
      return this.success({name: "删除成功!"})
    } else {
      return this.fail("删除失败!")
    }

  }

  /**
   * 设置一条或者多条数据的状态
   */
  setstatusAction() {
    let table = this.get("table");
    super.setstatusAction(table).then()
  }

}