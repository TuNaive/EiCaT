/**
 * Created by dengyuying on 2017/10/12.
 */

var ADDRESS_PAGE_SIZE = 2
var TOOL

require.config({
  paths: {}
})

var formKeyConf = {
  radio: {
    boardLayer: '板子层数',
    boardMaterial: '板材',
    // boardAmount: '数量',
    minLineSpace: '最小线宽线距',
    minAperture: '最小孔径',
    holeAmount: '孔数',
    halfHole: '半孔',
    testMethod: '测试方式'
  },
  select: {
    boardThickness: '板厚（mm）',
    aluminumOutThickness: '铜箔厚度 外层（oz）',
    aluminumInThickness: '内层（oz）',
    makeupNum: '拼版款数',
    surfacing: '表面处理',
    solderMaskColor: '阻焊颜色',
    charColor: '字符颜色',
    urgent: '加急'
  }
}

// var formRadioRules = _.mapValues(formKeyConf.radio, function (label, key) {
//   return {required: true}
// })

var formValConf = {
  boardLayer: {'0': '单面', '1': '双面', '2': '四层', '3': '六层', '4': '八层'},
  boardMaterial: {'0': 'FR4'/*, '1': 'CEM1', '2': 'FR1', '3': '铝基板'*/},
  boardThickness: {'0': '0.4', '1': '0.6', '2': '0.8', '3': '1.0', '4': '1.2', '5': '1.6', '6': '2.0', '7': '2.5'},
  aluminumOutThickness: {'0': '1', '1': '2'},
  aluminumInThickness: {'0': '0.5'},
  makeupNum: {'0': '1', '1': '2', '2': '3', '3': '4', '4': '5', '5': '6', '6': '7', '7': '8', '8': '9', '9': '10'},
  surfacing: {'0': '有铅喷锡', '1': '无铅喷锡', '2': '沉金'/*, '3': 'OSP', '4': '光板'*/},
  solderMaskColor: {'0': '绿色', '1': '红色', '2': '蓝色', '3': '白色', '4': '黑色', '5': '哑光黑色', '6': '无'},
  charColor: {'0': '白色', '1': '黄色', '2': '黑色', '3': '无'},
  minLineSpace: {'0': '5/5mil以上'},
  minAperture: {'0': '0.30mm以上'},
  holeAmount: {'0': '10万孔以下/m²', '1': '10-20万孔/m²', '2': '20万孔以上/m²'},
  halfHole: {'0': '无', '1': '一边半孔', '2': '二边半孔', '3': '三边半孔', '4': '四边半孔'},
  testMethod: {'0': '全部飞针测试(样板飞测免费)：光学AOI测试 + 飞针测试，成品直通率100%测试', '1': '抽测免费：成品直通率95%以上测试：全部光学AOI测试 + 飞针测试抽测（如抽测过程中直通率低于95%，此批全部免费飞针测试 ）', '2': '测试架测试：测试免费，测试架工具费为一次性收费，返单免费', '3': '目测：用人工目检，适合单面板及简单的板'},
  urgent: {'0': '正常交期', '1': '加急48小时', '2': '加急24小时', '3': '特快加急12小时', '4': '火箭加急8小时'}
}

var formClassConf = {
  // aluminumOutThickness: 'col-sm-10',
  // aluminumInThickness: 'col-sm-10',
  // surfacing: 'col-sm-10',
  minLineSpace: 'col-sm-4',
  minAperture: 'col-sm-4'
}

var formActiveConf = {
  boardLayer: 1,
  boardThickness: 5
}

require(['/static/pcbs/js/tool.js'], function (tool) {
  $(function ($) {
    TOOL = tool
    console.log('=========', $('#solderMaskColor'))
    // init form dom
    _.forEach(formKeyConf, function (obj, key) {
      _.forEach(obj, function (v, k) {
        appendRadio(key, k, v, formActiveConf[k], formClassConf[k])
      })
    })

    bindFormEvents()
  })
})

function appendRadio (type, field, label, activeIndex, widthClass) {
  $('#' + field).append(TOOL.generateFormElem(type, formValConf[field], field, label, activeIndex, widthClass))
}

function bindFormEvents () {
  var pcb = $('#pcb')

  generateAddress()

  pcb.steps({
    // startIndex: 2,
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
      initPcbStateAndEvents()
      initAddressStateAndEvents()
    },
    onStepChanging: function (event, currentIndex, newIndex) {
      // Allways allow previous action even if the current form is not valid!
      if (currentIndex > newIndex)
      {
        return true;
      }

      var target = $(event.target)
      var enquiryForm = $("#enquiryForm")
      var validRes = enquiryForm.valid()

      if (currentIndex === 0 &&
        newIndex === 1 &&
        validRes &&
        target.data('needCalc') !== false
      ) {
        // todo: add loading
        $.ajax({
          url: 'calculate',
          type: 'POST',
          dataType: 'json',
          data: enquiryForm.serializeArray(),
          success: function (data) {
            target.data('needCalc', false)
            if (data.rtnCode === 0) {
              pcb.steps('next')
              generateDetail(data.data.customDetail)
              generateFee(data.data.pcbFee)
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
        $('a[href="#next"]').html('上传PCB文件')
      }

      if (currentIndex === 0 && priorIndex === 1) {
        pcb.data('needCalc', true)
      }

      if (currentIndex === 2 && $('#addressList tbody').html()) {
        generateAddress()
      }
    },
    onFinishing: function (event, currentIndex) {
      return $("#pcbFileForm").valid();
    },
    onFinished: function (event, currentIndex) {
      var paramData = _.concat($("#enquiryForm").serializeArray(), $("#pcbFileForm").serializeArray(), [{name: 'fileUuid', value: $('#pcbFile').data('uuid')}])
      $.ajax({
        url: 'createOrder',
        type: 'POST',
        dataType: 'json',
        data: paramData,
        success: function (data) {
          if (data.rtnCode === 0) {
            // 跳转到我的订单
            window.location.href = '/account'
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

  $('#pcbFile').fileupload({
    url: 'upload',
    dataType: 'json',
    change: function (e, data) {
      var file = _.last(data.files)
      $('#pcbFileName').html(file.name)
    },
    done: function (e, data) {
      var res = data.result

      if (res.rtnCode === 0) {
        $(e.target).data('uuid', res.data.uuid).blur()
      } else {
        $('#pcbFileName').html('')
        _toastr.error(res.rtnMsg)
      }
    },
    error: function (err) {
      $('#pcbFileName').html('')
      _toastr.error(err)
    }
  });
}

function initFormValidates () {
  var enquiryForm = $("#enquiryForm")
  var pcbFileForm = $("#pcbFileForm")
  
  $.validator.addMethod('pcbFile', function (value, element, params) {
    return $('#pcbFileName').html()
  }, '请上传文件')

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

  enquiryForm.validate(validateConf)
  pcbFileForm.validate(_.merge({}, validateConf, {
    rules: {
      pcbFile: {
        pcbFile: true
      }
    }
  }))
}

function initPcbStateAndEvents () {
  $('#boardLayer input, #boardAmount').change(function () {
    var $this = $(this)
    var BASE_DELIVERY = 3
    var layer = $('#boardLayer input:checked').val()
    var amount = $('#boardAmount').val()

    var delivery = BASE_DELIVERY
      + ((amount < 100) ? 0 : 1)
      + Math.max(0, (layer - 1)) * 1

    $('#delivery').html(delivery + '天左右')
  })

  $('#boardLayer input').change(function () {
    var layer = $('#boardLayer input:checked').val()
    var surfacingHtml
    var materialHtml

    if (layer > 0) {
      surfacingHtml = TOOL.generateFormElem('select', formValConf.surfacing, 'surfacing', formKeyConf.select.surfacing, formActiveConf.surfacing, formClassConf.surfacing)
      materialHtml = TOOL.generateFormElem('radio', formValConf.boardMaterial, 'boardMaterial', formKeyConf.radio.boardMaterial, formActiveConf.boardMaterial, formClassConf.boardMaterial)

    } else {
      surfacingHtml = TOOL.generateFormElem('select', {'0': '有铅喷锡', '1': '无铅喷锡'}, 'surfacing', formKeyConf.select.surfacing, 0, formClassConf.surfacing)
      materialHtml = TOOL.generateFormElem('radio', {'2': 'FR1'}, 'boardMaterial', formKeyConf.radio.boardMaterial, 2, formClassConf.boardMaterial)
    }

    $('#surfacing').html(surfacingHtml)
    $('#boardMaterial').html(materialHtml)
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

function generateDetail (data) {
  var tableTpl = ''
  var tdTpl = _.template('<td><%- label %></td><td <%- tdProps %>><%- value %></td>')

  _.forEach(data, function (obj, idx) {
    var complieConf = _.merge({
      tdProps: obj.field === 'comment' ? 'colspan=3' : ''
    }, obj)

    if (idx % 2 === 0) {
      tableTpl += '<tr>' + tdTpl(complieConf)
    } else {
      tableTpl += tdTpl(complieConf) + '</tr>'
    }
  })

  $('#machiningDetail').html(tableTpl)
}

function generateFee (data) {
  var tableTpl = ['<tr>', '<tr>']

  _.forEach(data, function (obj, idx) {
    tableTpl[0] += '<td>' + obj.label +  '</td>'
    tableTpl[1] += '<td>' + obj.value +  '</td>'
  })

  tableTpl[0] += '</tr>'
  tableTpl[1] += '</tr>'

  $('#priceDetail').html(tableTpl.join(''))
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