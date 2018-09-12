$(function ($) {
  initFormValidate()
  bindEvents()
  _bindUpload('#bomFile')
})

function initFormValidate () {
  var form = $("#bomFileForm")

  form.validate({
    errorPlacement: function errorPlacement (error, element) {
      element.after(error)
    }
  })
}

function bindEvents () {
  var form = $("#nonstandardForm")
  $('#generateOrder').click(function () {
    var valid = form.valid()
    var param = [
      {
        name: 'goods_id',
        value: $('#goods_id').val()
      },
      {
        name: 'type',
        value: $('#generateOrder').data('type')
      },
      {
        name: 'fileUuid',
        value: $('#bomFile').data('uuid')
      }]
    if (valid) {
      // todo: add loading
      $.ajax({
        url: 'upload/createEnquire',
        type: 'POST',
        dataType: 'json',
        data: _.concat(form.serializeArray(), param),
        success: function (data) {
          if (data.errno === 0) {
            // 跳转到 bom 询价单页面
            window.location.href = '/account/nonstandard/enquire'
          } else {
            console.log(data.errmsg)
          }
        },
        error: function (err) {
          console.log(err)
        }
      })
    }
  })
}