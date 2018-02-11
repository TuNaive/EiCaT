
$(document).ready(function() {
  bindFormEvents();
});

function bindFormEvents() {
  $("#ajaxModal").bind('hide.bs.modal',function(){
   $(".modal-backdrop").remove();
  })
}
