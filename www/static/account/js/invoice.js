
// require([], function () {
//   $(function ($) {
//     bindFormEvents();
//   })
// })
$(document).ready(function() {
  bindFormEvents();
  // setupData();
});
function bindFormEvents() {
  var self = this;
  $('.btn-set').click(function (event) {
    var dataId = $(event.target).data('val');
    setupDefault(event, dataId);
  })
  $('.btn-del').click(function (event) {
    var dataId = $(event.target).data('val');
    self.dataId = dataId;
  })
  $('#sureBtn').click(function () {
    delInfo(self.dataId)
  })
  $('#cancelBtn').click(function () {
    $('.del-invo-dialog').modal('hide')
  })
}

function delInfo(dataId) {
  $.ajax({
    url: '/account/invoice/delete',
    type: 'POST',
    dataType: 'json',
    data: {id: dataId},
    success: function (data) {
      $('.del-invo-dialog').modal('hide')
      if (data.rtnCode === 0) {
        _toastr(data.rtnMsg, "top-right", "success", false);
        setTimeout(function(){
          location.reload();
        },1000);
      } else {
        _toastr(data.rtnMsg, "top-right", "error", false);
      }
    },
    error: function (err) {
      $('.del-invo-dialog').modal('hide')
      _toastr('网络问题，请稍后再试', "top-right", "error", false);
    }
  })
}

function setupDefault(event, dataId) {
  $.ajax({
    url: '/account/invoice/default',
    type: 'POST',
    dataType: 'json',
    data: {id: dataId},
    success: function (data) {
      if (data.rtnCode === 0) {
        $('.btn-set').each(function (index, ele) {
          $(ele).removeClass('btn-success');
          $(ele).text('设为默认发票');
        })
        $(event.target).addClass('btn-success');
        $(event.target).text('默认发票');
        _toastr(data.rtnMsg, "top-right", "success", false);
      } else {
        _toastr(data.rtnMsg, "top-right", "error", false);
      }
    },
    error: function (err) {
      _toastr('网络问题，请稍后再试', "top-right", "error", false);
    }
  })
}

