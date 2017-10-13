/**
 * Created by dengyuying on 2017/10/12.
 */

define(['lodash'], function (_) {
  const tool = {}

  /*
   * radio dom 的生成函数
   * @param {Array} values
   * */
  tool.generateRadioDom = function (values, field, label) {
    if (!_.isArray(values) || _.isEmpty(values)) {
      throw new Error('values must be an Array without empty')
    }

    const compiled = _.template(
      '<div class="form-group">' +
        '<label for="<%= field %>" class="col-sm-2 control-label"><%= label + ":" %></label>' +
        '<div class="col-sm-4">' +
          '<% _.forEach(values, function(val) { %>' +
            '<label class="radio-inline">' +
              '<input type="radio" name="<%= field %>" id="<%= field + 1 %>" value="option1"><%- val ' +
            '</label>' +
          '<% }); %>' +
        '</div>' +
      '</div>'
    )

    const tpl = compiled(values, field, label)

    return $(tpl)
  }

  return tool
})