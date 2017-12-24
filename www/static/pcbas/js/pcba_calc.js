/**
 * Created by houchunyang on 2017/10/26.
 */
var ADDRESS_PAGE_SIZE = 2, INVOICE_PAGE_SIZE = 2
require.config({
  paths: {}
})
var Regexmap
require(['/static/pcbas/js/enum.js',
  '/static/pcbas/js/validate.js'], function (Enum, regexmap) {
  $(function ($) {
    Regexmap = regexmap
    bindFormEvents(Enum)
  })
})

function bindFormEvents (Enum) {
  var self = this
  var pcba = $('#pcba')
  generateAddress()
  generateInvoice()
  pcba.steps({
    startIndex: 0,
    headerTag: "h3",
    bodyTag: "fieldset",
    transitionEffect: "slideLeft",
    labels: {
      finish: "提交订单",
      next: "计算价格",
      previous: "返回",
    },
    onInit: function (event, currentIndex) {
      initFormValidates()
      initAddressStateAndEvents()
      initInvoiceStateAndEvents()
    },
    onStepChanging: function (event, currentIndex, newIndex) {
      var target = $(event.target)
      var enquiryForm = $("#enquiryForm")
      var validRes = enquiryForm.valid()
      // var validRes = Validate.formValid($("#enquiryForm")).valid()
      if ( currentIndex === 0 && newIndex === 1 && validRes && target.data('needCalc') !== false ) {
        // todo: add loading
        $.ajax({
          url: 'calculate',
          type: 'POST',
          dataType: 'json',
          data: enquiryForm.serializeArray(),
          success: function (data) {
            target.data('needCalc', false)
            if (data.rtnCode === 0) {
              pcba.steps('next')
              // generateDetail(data.data.customDetail)
              // generateFee(data.data.pcbFee)
              self.feeData = data.data
              setupNext(data.data, Enum)
              setupFee(data.data)
            } else {
              console.log(data.rtnMsg)
            }
          },
          error: function (err) {
            console.log(err)
          }
        })

        return false
      }

      return validRes
    },
    onStepChanged: function (event, currentIndex, priorIndex) {
      if (currentIndex === 1) {
        $('a[href="#next"]').html('上传PCBA文件')
      }

      if (currentIndex === 0 && priorIndex === 1) {
        pcba.data('needCalc', true)
      }

      if (currentIndex === 2 && $('#addressList tbody').html()) {
        generateAddress()
      }
    },
    onFinishing: function (event, currentIndex) {
      return $("#pcbaFileForm").valid();
    },
    onFinished: function (event, currentIndex) {
      var paramData = _.concat($("#enquiryForm").serializeArray(), $("#pcbaFileForm").serializeArray(), [{name: 'fileUuid', value: $('#pcbaFile').data('uuid')}])
      var projceFee = {name: "projceFee", value: _.get(self, 'feeData.projceFee')}
      var plateSizeFee = {name: "plateSizeFee", value: _.get(self, 'feeData.plateSizeFee')}
      var otherFee = {name: "otherFee", value: _.get(self, 'feeData.otherFee')}
      var totalFee = {name: "totalFee", value: _.get(self, 'feeData.totalFee')}
      var feeArr = [projceFee, plateSizeFee, otherFee, totalFee]
      paramData = _.concat(paramData, feeArr)
      $.ajax({
        url: 'createOrder',
        type: 'POST',
        dataType: 'json',
        data: paramData,
        success: function (data) {
          if (data.rtnCode === 0) {
            // 跳转到我的订单
            // window.location.href = '/account'
          } else {
            console.log(data.rtnMsg)
          }
        },
        error: function (err) {
          console.log(err)
        }
      })
    }
  })

  $('#pcbaFile').fileupload({
    url: 'upload',
    dataType: 'json',
    change: function (e, data) {
      var file = _.last(data.files)
      $('#pcbaFileName').html(file.name)
    },
    done: function (e, data) {
      var res = data.result

      if (res.rtnCode === 0) {
        $(e.target).data('uuid', res.data.uuid).blur()
      } else {
        $('#pcbaFileName').html('')
        _toastr.error(res.rtnMsg)
      }
    },
    error: function (err) {
      $('#pcbaFileName').html('')
      _toastr.error(err)
    }
  });
}

function initFormValidates () {
  var enquiryForm = $("#enquiryForm")
  var pcbaFileForm = $("#pcbaFileForm")
  
  $.validator.addMethod('pcbaFile', function (value, element, params) {
    return $('#pcbaFileName').html()
  }, '请上传文件')

  $.validator.addMethod('pointBGA', function (value, element, params) {
    return _.toNumber($('#pointBGA').val()) + _.toNumber($('#pointCHIP').val()) + _.toNumber($('#pointIC').val()) <= 500
  }, 'CHIP+IC+BGA总点数要小于500点，大于请转人工')

  $.validator.addMethod('boardNumber', function (value, element, params) {
    return value <= 30000
  }, '订单数量0~30000')

  $.validator.addMethod('pointDIP', function (value, element, params) {
    return value <= 1000
  }, 'DIP脚数0~1000')

  $.validator.addMethod('contact', function (value, element, params) {
    return Regexmap.name.test(value)
  }, '请输入正确的姓名')

  $.validator.addMethod('mobile', function (value, element, params) {
    return Regexmap.mobile.test(value)
  }, '请输入正确手机号码')

  $.validator.addMethod('email', function (value, element, params) {
    return Regexmap.email.test(value)
  }, '请输入正确的电子邮箱')

  var validateConf = {
    ignore: '.ignore',
    errorPlacement: function errorPlacement (error, element) {
      var groupParent = element.parentsUntil('.form-group', '[class^="col-sm-"]')
      if (groupParent.length) {
        groupParent.append(error)
      } else {
        element.after(error)
      }
    }
  }
  enquiryForm.validate(_.merge({}, validateConf, {
    rules: {
      pointBGA: {
        pointBGA: true
      },
      boardNumber: {
        boardNumber: true
      },
      pointDIP: {
        pointDIP: true
      }
    }
  }))
  pcbaFileForm.validate(_.merge({}, validateConf, {
    rules: {
      pcbaFile: {
        pcbaFile: true
      },
      contact: {
        contact: true
      },
      mobile: {
        mobile: true
      },
      email: {
        email: true
      }
    }
  }))
}

function setupNext(data, Enum) {
  console.log('------setup', data)
  if (!_.isNil(data.plateSize)) {
    data.plateSize = Enum.plateSize[data.plateSize]
  }
  _.map(data, function (value, key) {
    $('#s' + key).html(value)
  })
}

function setupFee(data) {
  $('#pcbaMoney').html('¥' + data.totalFee)
  $('#pcbaAllmoney').html('¥' + data.totalFee)
}



function generateInvoice (pageSize) {
  var tdTpl = _.template(
    '<tr>' +
      '<td>' +
        '<input type="radio" name="invoiceId" value="<%- item.id %>" <%- item.is_default == 1 ? " checked" : "" %>>' +
      '</td>' +
      '<td ><%- item.invoiceTitle %></td>' +
      '<td><%- item.receiveName %></td>' +
      '<td><%- item.receiveAddress %></td>' +
      '<td>' +
        '<a href="/account/invoice/editmodal?id=<%-item.id %>&type=1&check=1" data-toggle="ajaxModal" class="margin-right-10">' + '查看' + '</a>' + '<a href="/account/invoice/editmodal?id=<%-item.id %>&type=1" data-toggle="ajaxModal">' + '编辑' + '</a>' +
      '</td>' +
    '</tr>'
  )

  pageSize = _.defaultTo(pageSize, INVOICE_PAGE_SIZE)

  $.ajax({
    url: 'getInvoice',
    type: 'POST',
    dataType: 'json',
    data: {pageSize: pageSize},
    success: function (data) {
      if (data.rtnCode === 0) {
        var invoiceHtml = _.map(_.get(data, 'data.data'), function (item) {
          return tdTpl({item: item})
        })

        var total = _.get(data, 'data.count')

        if (total > pageSize) {
          $('#showAllInvoice').html('显示全部发票')
        } else {
          $('#showAllInvoice').html('收起全部发票').data('disabled', true)
        }

        $('#invoiceList tbody').html(invoiceHtml.join('')).data('total', total)
      } else {
        console.log(data.rtnMsg)
      }
    },
    error: function (err) {
      console.log(err)
    }
  })  
}

function initInvoiceStateAndEvents() {
  $('#refreshInvoice').click(function () {
    generateInvoice()
  })

  $('#invoice0').click(function () {
    $('#invoiceList').show()
    $('#showAllInvoice').show()
  })

  $('#invoice1').click(function () {
    $('#invoiceList').hide()
    $('#showAllInvoice').hide()
  })

  $('#showAllInvoice').click(function () {
    var $this = $(this)
    var $invoiceTb = $('#invoiceList tbody')
    var total = $invoiceTb.data('total')
    var $invoiceTrs = $invoiceTb.find('tr')
    var $extraTrs = $invoiceTrs.filter(':gt(' + (INVOICE_PAGE_SIZE - 1) + ')')

    if ($this.data('disabled')) {
      $this.html('显示全部发票').data('disabled', false)
      $extraTrs.hide()
    } else {
      $this.html('收起全部发票').data('disabled', true)
     
      if ($invoiceTrs.length < total) {
        generateInvoice(9999)
      } else {
        $extraTrs.show()
      }
      
    }
  })
}

function initAddressStateAndEvents () {
  $('#refreshAddress').click(function () {
    generateAddress()
  })

  $('#showAllAddress').click(function () {
    var $this = $(this)
    var $addressTb = $('#addressList tbody')
    var total = $addressTb.data('total')
    var $addressTrs = $addressTb.find('tr')
    var $extraTrs = $addressTrs.filter(':gt(' + (ADDRESS_PAGE_SIZE - 1) + ')')

    if ($this.data('disabled')) {
      $this.html('显示全部地址').data('disabled', false)
      $extraTrs.hide()
    } else {
      $this.html('收起全部地址').data('disabled', true)
     
      if ($addressTrs.length < total) {
        generateAddress(9999)
      } else {
        $extraTrs.show()
      }
    }
  })
}

function generateAddress (pageSize) {
  var tdTpl = _.template(
    '<tr>' +
      '<td>' +
        '<input type="radio" name="addressId" value="<%- item.id %>" <%- item.is_default == 1 ? " checked" : "" %>>' +
      '</td>' +
      '<td ><%- item.accept_name %></td>' +
      '<td><%- item.province %>,<%- item.city %>,<%- item.county %></td>' +
      '<td><%- item.addr %></td>' +
      '<td>' +
        '<%- item.zip %>' +
      '</td>' +
      '<td>' +
        '<%- item.mobile %>' +
      '</td>' +
    '</tr>'
  )

  pageSize = _.defaultTo(pageSize, ADDRESS_PAGE_SIZE)

  $.ajax({
    url: 'getAddress',
    type: 'POST',
    dataType: 'json',
    data: {pageSize: pageSize},
    success: function (data) {
      if (data.rtnCode === 0) {
        var addressHtml = _.map(_.get(data, 'data.data'), function (item) {
          return tdTpl({item: item})
        })

        var total = _.get(data, 'data.count')

        if (total > pageSize) {
          $('#showAllAddress').html('显示全部地址')
        } else {
          $('#showAllAddress').html('收起全部地址').data('disabled', true)
        }  

        $('#addressList tbody').html(addressHtml.join('')).data('total', total)
      } else {
        console.log(data.rtnMsg)
      }
    },
    error: function (err) {
      console.log(err)
    }
  })  
}
// function generateDetail (data) {
//   var tableTpl = ''
//   var tdTpl = _.template('<td><%- label %></td><td <%- tdProps %>><%- value %></td>')

//   _.forEach(data, function (obj, idx) {
//     var complieConf = _.merge({
//       tdProps: obj.field === 'comment' ? 'colspan=3' : ''
//     }, obj)

//     if (idx % 2 === 0) {
//       tableTpl += '<tr>' + tdTpl(complieConf)
//     } else {
//       tableTpl += tdTpl(complieConf) + '</tr>'
//     }
//   })

//   $('#machiningDetail').html(tableTpl)
// }

// function generateFee (data) {
//   var tableTpl = ['<tr>', '<tr>']

//   _.forEach(data, function (obj, idx) {
//     tableTpl[0] += '<td>' + obj.label +  '</td>'
//     tableTpl[1] += '<td>' + obj.value +  '</td>'
//   })

//   tableTpl[0] += '</tr>'
//   tableTpl[1] += '</tr>'

//   $('#priceDetail').html(tableTpl.join(''))
// }