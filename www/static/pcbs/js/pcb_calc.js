/**
 * Created by dengyuying on 2017/10/12.
 */

require(['./tool.js'], function (tool) {
  $(function ($) {
    tool.generateRadioDom(['单面', '双面', '四层', '六层', '八层'], 'boardLayer', '板子层数')
  })
})

