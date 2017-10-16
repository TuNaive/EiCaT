$(function ($) {
  var form = $("#pcbFileForm")

  form.validate({
    errorPlacement: function errorPlacement (error, element) {
      console.log('------element', element)
      element.parentsUntil('.form-group', '[class^="col-sm-"]').append(error)
    }
  })

  $('#generateOrder').click(function () {
    form.valid()
  })
})