export default function () {
  /**省市三级联动 */
  var areas = $("#areas");
  if (areas.length > 0) {
    $('.add-addr-dialog').on('show.bs.modal', function () {
      // 初始化省
      $.ajax({
        url: "/account/address/getarea",
        data: {"pid":0},
        success: function (msg) {
          var originVal = $("#province").val()
          var province_arr = ['<option value="">--- 省份/直辖市 ---</option>']
          $.each(msg,function name(k,v) {
            province_arr.push('<option value="'+v.id+'">'+v.name+'</option>')
          })
          province_html = province_arr.join("")
          $("#province").html(province_html).val(originVal);
        } });
    })

    $(".add-addr-dialog #province").change(function (e) {
      var pid = $("#province option:selected").val();
      $.ajax({
        url: "/account/address/getarea",
        data: {"pid": pid},
        success: function (msg) {
          var province_arr = ['<option value="">--- 市 ---</option>']
          $.each(msg, function name(k, v) {
            province_arr.push('<option value="' + v.id + '">' + v.name + '</option>')
          })
          province_html = province_arr.join("")
          $("#city").html(province_html);
        }
      });
    })

    $(".add-addr-dialog #city").change(function (e) {
      var pid = $("#city option:selected").val();
      $.ajax({
        url: "/account/address/getarea",
        data: {"pid": pid},
        success: function (msg) {
          var province_arr = ['<option value="">--- 县/区 ---</option>']
          $.each(msg, function name(k, v) {
            province_arr.push('<option value="' + v.id + '">' + v.name + '</option>')
          })
          province_html = province_arr.join("")
          $("#county").html(province_html);
        }
      });
    })

    /**
     * 添加收货人地址
     */
    $(".add-addr-dialog form.add-addr").submit(function (e) {
      var data = $(this).serialize()
      $.ajax({
        type: "POST",
        url: "/account/address/addaddr",
        data: data,
        success: function (msg) {
          if (msg.errno == 0) {
            _toastr(msg.data.name, "top-right", "success", false);
            $('.add-addr-dialog').modal('hide')
            if (msg.data.type == 1) {
              setTimeout(function () {
                location.reload();
              }, 2000);
            } else {
              addr_add_html(msg.data.data);
            }


          } else {
            _toastr(msg.errmsg, "top-right", "error", false);
          }
        }
      });
      return false;
    })
  }
}