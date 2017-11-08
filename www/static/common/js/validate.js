/**
 * Created by dengyuying on 2017/11/2.
 */

/*
* 配置 validator
* */
$(function ($) {
  addValidateMethods()
})

function addValidateMethods () {
  var regs = {
    mobile: /^1[3457]\d{9}$/
  }

  var rules = {
    pcbFile: {
      errMsg: '请上传文件',
      handler: function (value, element, params) {
        return $('#pcbFileName').html()
      }
    },
    mobile: {
      errMsg: '请填写正确的手机号码',
      handler: function (value, element, params) {
        return regs.mobile.test(value)
      }
    }
  }

  var rule

  _.forEach(rules, function (obj, key) {
    $.validator.addMethod(key, obj.handler, obj.errMsg)
    $.validator.addClassRules(key, _.zipObject([key], [true]));
  });
}