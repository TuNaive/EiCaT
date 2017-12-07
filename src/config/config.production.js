// production config, it will load in production enviroment
module.exports = {
  port: 8360,
  workers: 2,
  setup: {
    ORDER_DELAY: 1440, // 默认订单作废时长（分钟）
  }
}
