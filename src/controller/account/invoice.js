import Base from './base.js'

export default class extends Base {

  async indexAction () {
    await this.service('account/invoice').getNorInvoiceList(this, this.post())
    // await this.service('account/invoice').getSpeInvoiceList(this, this.post())
    return this.display()
  }

  async saveAction () {
    const param = this.post()

    const user = { userId: think.user.uid }

    const edit = this.post('edit')

    let res
    if (!_.isNil(edit)) {
      res = await this.model('invoice').where({ userId: think.user.uid, id: this.post('dataId') }).update(this.post())
      if (!_.isNil(res)) {
        this.body = {
          rtnCode: 0,
          rtnMsg: '发票修改成功'
        }
      } else {
        this.body = {
          rtnCode: 999,
          rtnMsg: '发票修改失败'
        }
      }
    } else {
      res = await this.model('invoice').add(_.merge(param, user))
      if (!_.isNil(res)) {
        this.body = {
          rtnCode: 0,
          rtnMsg: '发票添加成功'
        }
      } else {
        this.body = {
          rtnCode: 999,
          rtnMsg: '发票添加失败'
        }
      }
    }
    
  }

  async editmodalAction () {
    console.log('------edit')
    // type 1 编辑  0 新增
    const type = this.get('type')
    if (_.isEqual(type, '1')) {
      const id = _.toNumber(this.get('id'))
      const check = _.toNumber(this.get('check'))
      const res = await this.model('invoice').where({id: id}).find()
      // this.assign('render', res)
      // this.assign('edit', 1)
      // this.assign('id', id)
      // this.assign('check', check)
      this.assign({
        render: res,
        edit: 1,
        id: id,
        check: check
      })
    }
    return this.display()
  }

  async deleteAction () {
    const id = this.post('id')
    const res = !_.isNil(id) && await this.model('invoice').where({id: id}).delete()
    console.log('-----delete', res)
    this.body = {
      rtnCode: 0,
      rtnMsg: '发票删除成功'
    }
  }

  async defaultAction () {
    const id = this.post('id')
    let res = !_.isNil(id) && await this.model("invoice").where({ userId:this.user.uid }).order("isDefault ASC").select();
    for(let val of res){
      if(val.id == id){
        val.isDefault = 1;
      }else{
        val.isDefault = 0;
      }
      await this.model("invoice").update(val);
    }
    return this.body = {
      rtnCode: 0,
      rtnMsg: '默认设置成功'
    }
  }

}
