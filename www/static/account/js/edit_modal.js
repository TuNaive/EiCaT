var Regexmap = {
  name: /^[\u4E00-\u9FA5A-Za-z]+$/,
  mobile: /^1[34578]\d{9}$/,
  email: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
}

$(document).ready(function() {
  bindFormEvents();
  setupData();
  initFormValidates()
});

function bindFormEvents() {
  $('#normalInvoice').click(function () {
    $('#invoiceForm').get(0).reset()
    $('#raceType').show()
    $('.invoice_special').hide()
  })

  $('#specialInvoice').click(function () {
    $('#raceType').hide()
    $('.invoice_special').show()
  })

  $('#personType').click(function () {
    $('#invoiceForm').get(0).reset()
    $('#invoiceTitle').hide()
    $('#invoiceTAXID').hide()
  })

  $('#companyType').click(function () {
    $('#invoiceTitle').show()
    $('#invoiceTAXID').show()
  })

  $('#saveBtn').click(function (event) {

    var invoiceForm = $("#invoiceForm")
    var validRes = invoiceForm.valid()
    if (validRes) {
      var edit = $(event.target).data('val')
      var dataId = $(event.target).data('id')
      if (edit === 1) { // 编辑
        var editArr = [{name: "edit", value: edit}, {name: "dataId", value: dataId}]
        saveInvoice(editArr)
      } else { // 新增
        saveInvoice()
      }
    }
  })

  $('#clearBtn').click(function () {
    $('#invoiceForm').get(0).reset()
  })

}

function setupData() {
  var invoiceType = $('#normalInvoice').data('val');
  var raceType = $('#personType').data('val');
  var agreeWrap = $('#agreeWrap').data('val');
  var btnWrap = $('#btnWrap').data('val');
  if (_.isEqual(invoiceType, 1)) {
    $('#specialInvoice').trigger('click');
  }
  if (_.isEqual(raceType, 1)) {
    $('#companyType').trigger('click');
  }
  if (_.isEqual(agreeWrap, 1)) {
    $('#agreeWrap').hide();
  }
  if (_.isEqual(btnWrap, 1)) {
    $('#btnWrap').hide();
  }
}

function saveInvoice(dataArr) {
  var invoiceForm = $('#invoiceForm')
  var paramData = invoiceForm.serializeArray()
  if (!_.isNil(dataArr)) {
    paramData = _.concat(paramData, dataArr)
  }
  $.ajax({
    url: '/account/invoice/save',
    type: 'POST',
    dataType: 'json',
    data: paramData,
    success: function (data) {
      $('.modal-dialog').modal('hide')
      if (data.rtnCode === 0) {
        _toastr(data.rtnMsg, "top-right", "success", false);
        setTimeout(function(){
          location.reload();
        },1000);
      } else {
        _toastr(data.rtnMsg,"top-right","error",false);
      }
    },
    error: function (err) {
      _toastr('网络问题，请稍后再试',"top-right","error",false);
    }
  })
}

function initFormValidates () {
  var invoiceForm = $("#invoiceForm")
  
  $.validator.addMethod('receiveName', function (value, element, params) {
    return $('#pcbaFileName').html()
  }, '请上传文件')

  $.validator.addMethod('pointBga', function (value, element, params) {
    return _.toNumber($('#pointBga').val()) + _.toNumber($('#pointChip').val()) + _.toNumber($('#pointIc').val()) <= 500
  }, 'CHIP+IC+BGA总点数要小于500点，大于请转人工')

  $.validator.addMethod('receivePhone', function (value, element, params) {
    return Regexmap.mobile.test(value)
  }, '请输入正确手机号码')

  var validateConf = {
    ignore: ':hidden',
    errorPlacement: function errorPlacement (error, element) {
      var groupParent = element.parentsUntil('.form-group', '[class^="col-sm-"]')
      if (groupParent.length) {
        groupParent.append(error)
      } else {
        element.after(error)
      }
    }
  }
  invoiceForm.validate(_.merge({}, validateConf, {
    rules: {
      receivePhone: {
        receivePhone: true
      }
    }
  }))
}