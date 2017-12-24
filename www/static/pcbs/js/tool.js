/**
 * Created by dengyuying on 2017/10/12.
 */

var labelTpl = '<label for="<%- field %>" class="col-sm-2 control-label"><%- label %>：</label>'
var tpls = {
  radio: labelTpl +
    '<div class="<%- widthClass || "col-sm-10" %>">' +
      '<% _.forEach(options, function(val, key) { %>' +
        '<label class="radio-inline">' +
          '<% if (key == activeIndex) { %>' +
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
          '<% if (key == activeIndex) { %>' +
            '<option value="<%- key %>" selected><%- val %></option>' +
          '<% } else { %>' +
            '<option value="<%- key %>"><%- val %></option>' +
          '<% } %>' +
        '<% }); %>' +
      '</select>' +
    '</div>'
}

var TOOL = {}

/*
 * radio dom 的生成函数
 * @param {String} type
 * @param {Obeject|Array} options {value: label}|[label]
 * @param {String} field
 * @param {String} label
 * */
TOOL.generateFormElem = function (type, options, field, label, activeIndex, widthClass) {
  if (!(_.isArray(options) || _.isObject(options))  || _.isEmpty(options)) {
    throw new Error(field, 'options must be an Array or Object without empty')
  }

  var tpl = tpls[type]

  if (_.isNil(tpl)) {
    throw new Error(field, 'finds no tpl')
  }

  var defaultVal = options[0] || _.keys(options)[0]

  var compiled = _.template(tpl)

  return compiled({options, field, label, defaultVal, activeIndex: _.defaultTo(activeIndex, 0), widthClass})
}