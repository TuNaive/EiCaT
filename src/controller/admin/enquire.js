import Admin from '../cmswing/admin'

module.exports = class extends Admin {
  constructor(ctx) {
    super(ctx); // 调用父级的 constructor 方法，并把 ctx 传递进去
    // 其他额外的操作
    this.tactive = "order"
    this.updateMap = {
      finish: {
        status: 1,
        title: '完成询价单'
      },
      void: {
        status: -1,
        title: '作废询价单'
      },
      remark: {
        title: '备注询价单'
      }
    }
  }

  /**
   * index action
   * @return {Promise} []
   */
  indexAction() {
    //auto render template file index_index.html

    return this.display();
  }

  //询价单列表
  async listAction() {
    let status = this.get("status");
    let map = {};
    if (!think.isEmpty(status)) {
      map.status = status;
      this.assign('status', status);
    }
    map.type = this.get("type") || 0;
    this.assign('type', map.type);
    let data = await this.model("enquire").where(map).page(this.get('page') || 1, 20).order("create_time DESC").countSelect();
    let html = this.pagination(data);
    this.assign('pagerData', html); //分页展示使用
    this.active = "admin/enquire/list";
    this.assign('list', data.data);
    this.meta_title = "询价单管理";
    return this.display();
  }

  /**
   * 更新询价单
   */
  async updateAction() {
    let operation = this.post("operation") || this.get("operation")
    let oprConf = this.updateMap[operation];
    if (this.isPost) {
      let id = this.post("id");
      let admin_remark = this.post("admin_remark");
      let finish = await this.model("enquire").where({id: id}).update({status: oprConf.status, admin_remark: admin_remark});
      if (finish) {
        return this.success({name: "操作成功！", url: this.referer()})
      } else {
        return this.fail("操作失败！")
      }

    } else {
      let id = this.get("id");
      this.assign("id", id);
      this.assign("operation", operation);
      this.meta_title = oprConf.title;
      return this.display();
    }
  }

  /**
   * 查看询价单
   * @returns {*}
   */
  async seeAction() {
    let id = this.get("id");
    this.meta_title = "查看询价单";
    //获取询价单信息
    let order = await this.model("enquire").find(id);    
    this.assign("data", order);
    return this.display();
  }
}