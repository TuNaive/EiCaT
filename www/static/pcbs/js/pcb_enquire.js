$(function ($) {
  initFormValidate()

  bindEvents()

  initUpload()
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
    var param = [{name: 'fileUuid', value: $('#pcbFile').data('uuid')}, {name: 'type', value: $('#generateOrder').data('type')}]
    if (valid) {
      // todo: add loading
      $.ajax({
        url: '/pcbsvr/pcb/createEnquire',
        type: 'POST',
        dataType: 'json',
        data: _.concat(form.serializeArray(), param),
        success: function (data) {
          if (data.errno === 0) {
            // 跳转到 pcb 询价单页面
            window.location.href = '/account/enquire/pcb?type=' + $('#generateOrder').data('type')
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

function initUpload () {
  $('#pcbFile').fileupload({
    url: '/pcbsvr/pcb/upload',
    dataType: 'json',
    change: function (e, data) {
      var file = _.last(data.files)
      $('#pcbFileName').html(file.name)
    },
    done: function (e, data) {
      var res = data.result

      if (res.errno === 0) {
        $(e.target).data('uuid', res.data.uuid).blur()
      } else {
        $('#pcbFileName').html('')
        _toastr.error(res.errmsg)
      }
    },
    error: function (err) {
      $('#pcbFileName').html('')
      _toastr.error(err)
    }
  })
}