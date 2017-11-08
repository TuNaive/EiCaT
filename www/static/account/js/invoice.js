
require([], function () {
  $(function ($) {
    bindFormEvents();
  })
})

function bindFormEvents() {
  var self = this;
  $('.btn-default').click(function (event) {
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
    url: 'delete',
    type: 'POST',
    dataType: 'json',
    data: {id: dataId},
    success: function (data) {
      $('.del-invo-dialog').modal('hide')
      if (data.rtnCode === 0) {
      } else {
        console.log(data.rtnMsg)
      }
    },
    error: function (err) {
      $('.del-invo-dialog').modal('hide')
      console.log(err)
    }
  })
}

function setupDefault(event, dataId) {
  $.ajax({
    url: 'default',
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
      } else {
        console.log(data.rtnMsg)
      }
    },
    error: function (err) {
      console.log(err)
    }
  })
}
