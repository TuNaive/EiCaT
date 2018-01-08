/**
 * Created by dengyuying on 2017/10/19.
 */

module.exports = [
  {
    cron: '55 17 * * *',
    handle: 'pcbsvr/pcb/clearUploadFile'
  },
  {
    cron: '*/1 * * * *',
    handle: 'account/crontab/cloa',
    type: 'one',
    enable: true // 关闭当前定时器，默认true
  }
]
