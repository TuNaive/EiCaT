const contains = (arr, str) => {
  // will implement object contains later
  if (_.isEmpty(arr) || _.isPlainObject(arr) || _.isNil(str)) {
    return false
  }

  if (_.isString(arr)) {
    arr = arr.split(',')
  } else if (_.isNumber(arr)) {
    arr = _.toString(arr)
  }

  return arrayContains(arr, str)
}

const insertFrag = (text, fragment, len) => {
  let rtn = ''
  for (let idx = 0; idx < text.length; idx += len) {
    rtn += text.substring(idx, idx + len) + fragment
  }

  showDebug([text, text.length, fragment, len, rtn])
  return rtn
}

export default env => {
  env.addFilter('contains', contains)
  env.addFilter('formatCurrency', num => formatCurrency(num))
  env.addFilter('insertFrag', insertFrag)
  env.addFilter('moment', (time, formatter) => {
    if (_.isNil(formatter)) {
      return moment(time).fromNow()
    } else {
      return moment(time).format(formatter)
    }
  })

  env.addFilter('getFileName', (uuid) => {
    return _.last(_.split(uuid, '_'))
  })

  /**
   * 获取用户名称
   */
  env.addFilter('get_nickname', async (uid, callback) => {
    const data = await get_nickname(uid);
    callback(null, data);
  }, true);

  env.addFilter("in_Array", function (str, arr) {
    arr = arr || 0;
    if (!think.isArray(arr)) {
      if (think.isNumber(arr)) {
        arr = "'" + arr + "'";
      }
      arr = arr.split(",");
    }
    //console.log(arr);
    return in_array(str, arr);
  })
  /**
   * 数字转ip
   */
  env.addFilter("int2ip", function (int) {
    return _int2iP(int);
  })

  env.addFilter("test", function (string, reg) {
    return (new RegExp(reg)).test(string);
  })

  /**
   * 根据栏目id获取栏目信息
   *
   */
  env.addFilter('get_cate', async (id, callback) => {
    let data = await get_cate(id);
    callback(null, data);
  }, true)

  env.addFilter("strToArray", function (str, sn = ",") {
    if (!think.isEmpty(str)) {
      let ss = str.split(sn);// 在每个逗号(,)处进行分解。
      //console.log(ss);
      return ss;
    } else {
      return str;
    }
  })

  /**
   * 获取文档url
   */
  env.addFilter('get_url', (name, id) => {
    return get_url(name, id)
  })

  /**
   * {{id|get_pic("m=1,w=200,h=200")}}
   */
  env.addFilter('get_pic', async (id, type, callback) => {
    let m, w, h;
    //console.log(type);
    let obj = {};
    for (let v of type.split(",")) {
      v = v.split("=");
      obj[v[0]] = v[1];
    }
    m = obj.m;
    w = obj.w;
    h = obj.h;
    let data = await get_pic(id, m, w, h);
    callback(null, data);
  }, true)

  /**
   * 价格格式化
   */
  env.addFilter("get_price_format", function (price, type) {
    return get_price_format(price, type);
  })

  /**
   * 美元价格格式化
   */
  env.addFilter("get_price_format_usd", function (price, type) {
    return get_price_format_usd(price, type);
  })

  env.addFilter("has_price", function (price) {
    return has_price(price);
  })

  env.addFilter("has_price_usd", function (price) {
    return has_price_usd(price);
  })

  /**
   * 获取模型信息
   * @param model_id 模型id 或 模型名称
   * @param field 字段
   * @param return 整条数据或字段数据
   * @
   */
  env.addFilter("getmode", async (model_id, field, callback) => {
    let data = await get_model(model_id, field);
    callback(null, data);
  }, true)

  env.addFilter("strToJson", function (str) {
    if (!think.isEmpty(str) && str !=0) {
      return JSON.parse(str);
    }
  })

  env.addFilter("jsonToStr", function (json) {
    if (!think.isEmpty(json)) {
      return JSON.stringify(json);
    }
  })

  /**
   *分析枚举类型配置值 格式 a:名称1,b:名称2
   */
  env.addFilter("parse_config_attr", function (str) {
      return parse_config_attr(str)
  })
  //格式化字段列表
  env.addFilter("get_list_field", function (data, grid, controller, module) {
      return get_list_field(data, grid, controller, module);
  })
  //解析分类信息当前状态
  env.addFilter("sort_act",function (id,getid) {
    //console.log(decodeURI(getid));
    //console.log(in_array(id, sanjiao(getid.split("."))));
    if(!think.isEmpty(getid)){
      return in_array(id,sanjiao(decodeURI(getid).split(".")));
    }
  })
  //解析分类信息url
  env.addFilter("sort_url", function (id,val,arr,http) {
    return sort_url(id,val,arr,http);
  })

  /**
   * 获取商品价格不格式
   */
  env.addFilter('get_price', function (price, type) {
    return get_price(price, type);
  })

  /**
   * 获取商品美元价格不格式
   */
  env.addFilter('get_price_usd', function (price, type) {
    return get_price_usd(price, type);
  })

  /**
   * 获取关联
   */
  env.addFilter("get_relation", async(id,model,pk,val, callback) => {
    let map ={};
    map[pk] = id;
    let data = await think.model(model,think.config("db")).where(map).getField(val,true);
    callback(null, data);
  }, true)

  /**
   * 时间戳格式化 dateformat('Y-m-d H:i:s')
   * @param extra 'Y-m-d H:i:s'
   * @param date  时间戳
   * @return  '2015-12-17 15:39:44'
   */
  env.addFilter("dateformat", function (extra, date) {
      return dateformat(date, extra);
  })
  
  /**
    *缓存权限列表 all_priv
    * @param catid 要验证的栏目id
    * @param roleid 用户组
    * @param action 权限类型
    * @param is_admin 谁否前台 0前台，1后台
    * @returns {bool} 返回flase 或true flase:没权限，true:有权限。
    */
   env.addFilter('priv', async(catid, roleid, action, is_admin = 0, type = true, callback) => {
     const isp = await priv(catid, roleid, action, is_admin, type);
     // console.log(isp);
     callback(null, isp);
   }, true);

  // todo: test
  env.addFilter("JSON", function (int) {
    return JSON.stringify(int);
  })
}
