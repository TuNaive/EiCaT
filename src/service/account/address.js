/**
 * Created by dengyuying on 2017/10/20.
 */

export default class extends think.Service {
  async assignAddressList() {
    console.log('=======user', this.user)
    let data = await this.model("address").where({user_id: this.user.uid}).page(this.get('page')).order("is_default DESC,id DESC").countSelect();
    let html = this.pagination(data);

    this.assign('pagination', html);

    if (!think.isEmpty(data.data)) {
      for (let val of data.data) {
        // val.province_num = val.province;
        // val.city_num = val.city;
        // val.county_num = val.county;
        val.province = await this.model("area").where({id: val.province}).getField("name", true);
        val.city = await this.model("area").where({id: val.city}).getField("name", true);
        val.county = await this.model("area").where({id: val.county}).getField("name", true);
      }
    }

    this.assign("list", data.data);
  }
}
