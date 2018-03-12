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
   * 获取模型信息
   * @param model_id 模型id 或 模型名称
   * @param field 字段
   * @param return 整条数据或字段数据
   * @author arterli <arterli@qq.com>
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

  // todo: test
  env.addFilter("JSON", function (int) {
    return JSON.stringify(int);
  })
}
