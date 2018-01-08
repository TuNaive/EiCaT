// default config
const isDev = think.env === 'development'
module.exports = {
  port: 2333,
  workers: 1,
  http_: isDev ? 1: 2, // 1:http,2:https
  setup: {
    ORDER_DELAY: 1440, // 默认订单作废时长（分钟）
  }
}
