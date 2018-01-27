/**省市三级联动 */
$(function () {
  $(document).on("change", "#province1", function (e) {
    var pid = $("#province1 option:selected").val();
    $.ajax({
      url: "/account/address/getarea",
      data: {"pid": pid},
      success: function (msg) {
        var province_arr = ['<option value="">--- 市 ---</option>']
        $.each(msg, function name(k, v) {
          province_arr.push('<option value="' + v.id + '">' + v.name + '</option>')
        })
        province_html = province_arr.join("")
        $("#city1").html(province_html);
      }
    });
  })


  $(document).on("change", "#city1", function (e) {
    var pid = $("#city1 option:selected").val();
    $.ajax({
      url: "/account/address/getarea",
      data: {"pid": pid},
      success: function (msg) {
        var province_arr = ['<option value="">--- 县/区 ---</option>']
        $.each(msg, function name(k, v) {
          province_arr.push('<option value="' + v.id + '">' + v.name + '</option>')
        })
        province_html = province_arr.join("")
        $("#county1").html(province_html);
      }
    });
  })

  //改价
  $("#adjust_amount").on("change", function (e) {
    var olde_order_amount = $(".olde_order_amount").attr('data-value');
    var adjust_amount = $("#adjust_amount").val();
    var order_amount = Number(olde_order_amount) + Number(adjust_amount);
    $("#order_amount").text(formatCurrency(order_amount));
  })
})
function formatCurrency(num) {
  num = num.toString().replace(/\$|\,/g, '');
  if (isNaN(num))
    num = "0";
  var sign = (num == (num = Math.abs(num)));
  num = Math.floor(num * 100 + 0.50000000001);
  var cents = num % 100;
  num = Math.floor(num / 100).toString();
  if (cents < 10)
    cents = "0" + cents;
  for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
    num = num.substring(0, num.length - (4 * i + 3)) + ',' +
      num.substring(num.length - (4 * i + 3));
  return (((sign) ? '' : '-') + num + '.' + cents);
}