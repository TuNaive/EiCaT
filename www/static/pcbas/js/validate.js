
define([], function () {

  var Regexmap = {
    name: /^[\u4E00-\u9FA5A-Za-z]+$/,
    mobile: /^1[34578]\d{9}$/,
    email: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
  }

  return Regexmap
})