/**
 * Created by dengyuying on 2017/10/12.
 */

var labelTpl = '<label for="<%- field %>" class="col-sm-2 control-label"><%- label %>：</label>'
var tpls = {
  radio: labelTpl +
    '<div class="<%- widthClass || "col-sm-10" %>">' +
      '<% _.forEach(options, function(val, key) { %>' +
        '<label class="radio-inline">' +
          '<% if (key === 0) { %>' +
            '<input type="radio" name="<%- field %>" class="required" id="<%- field + _.capitalize(key) %>" value="<%- key %>" checked><%- val %>' +
          '<% } else { %>' +
            '<input type="radio" name="<%- field %>" class="required" id="<%- field + _.capitalize(key) %>" value="<%- key %>"><%- val %>' +
          '<% } %>' +
        '</label>' +
      '<% }); %>' +
    '</div>',
  select: labelTpl +
    '<div class="<%- widthClass || "col-sm-4" %>">' +
      '<select class="form-control required" name="<%- field %>" id="<%- field %>">' +
        '<% _.forEach(options, function(val, key) { %>' +
          '<option><%- val %></option>' +
        '<% }); %>' +
      '</select>' +
    '</div>'
}

define([], function () {
  var tool = {}

  /*
   * radio dom 的生成函数
   * @param {String} type
   * @param {Obeject|Array} options {value: label}|[label]
   * @param {String} field
   * @param {String} label
   * */
  tool.generateFormElem = function (type, options, field, label, widthClass) {
    if (!(_.isArray(options) || _.isObject(options))  || _.isEmpty(options)) {
      throw new Error(field, 'options must be an Array or Object without empty')
    }

    var tpl = tpls[type]

    if (_.isNil(tpl)) {
      throw new Error(field, 'finds no tpl')
    }

    var defaultVal = options[0] || _.keys(options)[0]

    var compiled = _.template(tpl)

    return $(compiled({options, field, label, defaultVal, widthClass}))
  }

  return tool
})