$(function ($) {
  var form = $("#pcbFileForm")

  form.validate({
    errorPlacement: function errorPlacement (error, element) {
      element.parentsUntil('.form-group', '[class^="col-sm-"]').append(error)
    }
  })

  $('#generateOrder').click(function () {
    debugger
    form.valid()
  })

  $('#pcbFile').fileupload({
    url: 'upload',
    dataType: 'json',
    done: function (e, data) {
      console.log('-------', data)
      $.each(data.result.files, function (index, file) {
        $('<p/>').text(file.name).appendTo(document.body);
      })
    }
  })
})