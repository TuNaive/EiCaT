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
  var form = $("#bomFileForm")
  $('#generateOrder').click(function () {
    var valid = form.valid()
    var param = [{name: 'fileUuid', value: $('#bomFile').data('uuid')}, {name: 'type', value: $('#generateOrder').data('type')}]
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
            window.location.href = '/account/bom/enquire'
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