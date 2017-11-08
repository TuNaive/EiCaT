
$(document).ready(function() {
  bindFormEvents();
  setupData();
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
    var edit = $(event.target).data('val')
    var dataId = $(event.target).data('id')
    console.log('-----save', edit, dataId)
    if (edit === 1) { // 编辑
      console.log('-----edit')
      var editArr = [{name: "edit", value: edit}, {name: "dataId", value: dataId}]
      saveInvoice(editArr)
    } else { // 新增
      saveInvoice()
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
    url: 'save',
    type: 'POST',
    dataType: 'json',
    data: paramData,
    success: function (data) {
      if (data.rtnCode === 0) {
      } else {
        console.log(data.rtnMsg)
      }
    },
    error: function (err) {
      console.log(err)
    }
  })
}