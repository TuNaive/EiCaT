$(function ($) {
  initFormValidate()

  bindEvents()

  _bindUpload('#pcbFile')
})

function initFormValidate () {
  var form = $("#pcbFileForm")

  form.validate({
    errorPlacement: function errorPlacement (error, element) {
      element.after(error)
    }
  })
}

function bindEvents () {
  var form = $("#pcbFileForm")

  $('#generateOrder').click(function () {
    var valid = form.valid()

    if (valid) {
      // todo: add loading
      $.ajax({
        url: '/pcbsvr/pcb/createEnquire',
        type: 'POST',
        dataType: 'json',
        data: _.concat(form.serializeArray(), [{name: 'fileUuid', value: $('#pcbFile').data('uuid')}]),
        success: function (data) {
          if (data.errno === 0) {
            // 跳转到 pcb 询价单页面
            window.location.href = '/account/enquire/pcb'
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