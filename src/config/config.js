// default config
const isDev = think.env === 'development'
module.exports = {
  port: 2333,
  workers: 1,
  http_: isDev ? 1: 2, // 1:http,2:https
  user_administrator: [468], // 数组格式，可以配置多个[1,2,3]
  setup: {
    ORDER_DELAY: 1440, // 默认订单作废时长（分钟）
  }
}
