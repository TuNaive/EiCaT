import _ from 'lodash'
import moment from 'moment'
import NP from 'number-precision'

moment.locale('zh-cn')

global._ = _

global.moment = moment

global.NP = NP

global.showDebug = messages => {
  console.log('\n=========== Debug ===========')
  console.log(_.toString(messages), '\n')
}

global.encryptPassword = (password, md5encoded = false) => {
  password = md5encoded ? password : think.md5(password)
  // todo: test admin
  return think.md5(think.md5('whatthefuck') + password + think.md5('isthis'))
  // return think.md5(think.md5('www.cmswing.com') + password + think.md5('Arterli'));
}

global.toHierarchy = (data, pid = 0) => {
  const rtn = []
  for (let idx = 0, len = data.length; idx < len; idx++) {
    let dr = data[idx]
    if (dr.pid === pid) {
      dr.children = toHierarchy(data, dr.id)
      rtn.push(dr)
    }
  }
  return rtn
}

global.arrayContains = (arr, str) => {
  for (let idx = 0, len = arr.length; idx < len; idx++) {
    if (_.toString(str) === _.toString(arr[idx])) {
      return true
    }
  }
  return false
}

/**
 * ip转数字
 * @param ip
 * @returns {number}
 * @private
 */
/* global _ip2int(ip) */
global._ip2int = function(ip) {
  var num = 0;
  ip = ip.split('.');
  num = Number(ip[0]) * 256 * 256 * 256 + Number(ip[1]) * 256 * 256 + Number(ip[2]) * 256 + Number(ip[3]);
  num = num >>> 0;
  return num;
};

/**
 * 把返回的数据集转换成Tree
 * @param array data 要转换的数据集
 * @param string pid parent标记字段
 * @return array
 */
/* global arr_to_tree */
global.arr_to_tree = function(data, pid) {
  var result = [], temp;
  var length = data.length;
  for (var i = 0; i < length; i++) {
    if (data[i].pid == pid) {
      result.push(data[i]);
      temp = arr_to_tree(data, data[i].id);
      if (temp.length > 0) {
        data[i].children = temp;
        data[i].chnum = data[i].children.length;
      }
    }
  }
  return result;
};

/**
 *根据uid获取用户昵称
 * @param uid 用户id
 * @returns Promise {*}
 */
/* global get_nickname */
global.get_nickname = async(uid) => {
  // console.log(uid);
  // let data = await think.model('member', think.config("model")).cache(1000).get_nickname(uid);
  const data = await think.model('member').get_nickname(uid);
  return data;
};

/**
 * 返回一个自定义用户函数给出的第一个参数
 *  call_user_func（回调 函数名， [参数]）
 * @param cb  函数名
 * @param params 数组格式传入参数
 */
/* global call_user_func */
global.call_user_func = function(cb, params) {
  let func = eval(cb);
  if (!think.isArray(params)) {
    params = [params];
  }
  return func.apply(cb, params);
}

//时间格式
/* global time_format */
global.time_format = (time) => {
  return moment(time).format('YYYY-MM-DD HH:mm:ss');
}

/* global str_replace()
 * str_replace(条件[]，替换内容[],被替换的内容)
 * @param search
 * @param replace
 * @param subject
 * @param count
 * @returns {*}
 */
/* global str_replace */
global.str_replace = function(search, replace, subject, count) {
  var i = 0, j = 0, temp = '', repl = '', sl = 0, fl = 0,
    f = [].concat(search),
    r = [].concat(replace),
    s = subject,
    ra = r instanceof Array, sa = s instanceof Array;
  s = [].concat(s);
  if (count) {
    this.window[count] = 0;
  }

  for (i = 0, sl = s.length; i < sl; i++) {
    if (s[i] === '') {
      continue;
    }
    for (j = 0, fl = f.length; j < fl; j++) {
      temp = s[i] + '';
      repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
      s[i] = (temp).split(f[j]).join(repl);
      if (count && s[i] !== temp) {
        this.window[count] += (temp.length - s[i].length) / f[j].length;
      }
    }
  }
  return sa ? s : s[0];
}