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
  return think.md5(think.md5('whatthefuck') + password + think.md5('isthis'))
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