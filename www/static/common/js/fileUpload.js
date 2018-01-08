/*
 * 绑定 upload 事件
 * @param {Obeject|Array} upload dom selector selector|[selectors]
 * */
_bindUpload = function (selectors) {
  if (!_.isArray(selectors)) {
    selectors = [selectors]
  }

  _.forEach(selectors, function (selector) {
    var nameSelector = selector + 'Name'
    
    $(selector).fileupload({
      url: 'upload',
      dataType: 'json',
      change: function (e, data) {
        $(nameSelector).html('加载中……').siblings('label.error').hide()
      },
      done: function (e, data) {
        var res = data.result
        var file = _.last(data.files)

        if (res.errno === 0) {
          $(e.target).data('uuid', res.data.uuid).blur()
          $(nameSelector).html(file.name)
        } else {
          $(nameSelector).html('')
          _toastr(res.errmsg, 'top-center', 'error', false)
        }
      },
      error: function (err) {
        $(nameSelector).html('')
        _toastr(err.message, 'top-center', 'error', false)
      }
    })
  })
}