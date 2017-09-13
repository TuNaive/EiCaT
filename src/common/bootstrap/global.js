import _ from 'lodash'

global._ = _

global.encryptPassword = (password, md5encoded) => {
  md5encoded = md5encoded || false;
  password = md5encoded ? password : think.md5(password);
  return think.md5(think.md5('www.cmswing.com') + password + think.md5('Arterli'));
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