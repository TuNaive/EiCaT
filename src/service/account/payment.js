import paypal from 'paypal-rest-sdk'

paypal.configure({
  //'mode': think.env === 'production' ? 'live' : 'sandbox', //sandbox or live
  'mode': 'sandbox',
  'client_id': 'AeFWGEbWjmgjUa4tnnOMIzoTEvSMp3-C5XEcKyi1BhY0LRRKzzIDnaF0AF89N05J96wbdAhcVcPyCy_W',
  'client_secret': 'EGXEYgrekbRjlfnXQU9M8Gs-GfK1zlz7HMwR_ycuU47NMqi39e8vsicsEqwD-Uk-u4a1gPnFTGwjOaxZ',
  'headers' : {
    'custom': 'header'
  }
});

module.exports = class extends think.Service {
  /**
     * init
     * @return {}         []
     */
  constructor(ctx) {
    super(ctx);
    this.http = ctx;
    this.http_ = think.config('http_') == 1 ? 'http' : 'https';

    // todo: dev test
    this.http_= 'https'
    this.http = {
      host: '127.0.0.1'
    }

  }

  // 发起付款
  async createPayment () {
    const channel = arguments[0]

    if (channel == 'paypal') {
      return await this.createPaypal.apply(this, _.slice(arguments, 1))
    } else {
      return await this.createPingxx.apply(this, arguments)
    }
  }

  // 查询付款信息
  async getPayment () {
    const channel = arguments[0]

    if (channel == 'paypal') {
      return await this.getPaypal.apply(this, _.slice(arguments, 1))
    } else {
      return await this.getPingxx.apply(this, _.slice(arguments, 1))
    }
  }

  // 查询付款信息
  async excutePayment () {
    const channel = arguments[0]

    if (channel == 'paypal') {
      return await this.excutePaypal.apply(this, arguments)
    } else {
      return await this.getPingxx.apply(this, _.slice(arguments, 1))
    }
  }

  async createPingxx(channel, order_no, order_amount, ip, open_id) {
    let http_ = this.http_;

    // todo: dev test
    ip = '127.0.0.1'

    let config;
    let extra = {};
    const amount = Number(order_amount) * 100;
    const setup = await think.config('settings');
    const pingpp = require('pingpp')(setup.PINGXX_LIVE_SECRET_KEY);
    pingpp.setPrivateKeyPath(think.ROOT_PATH + '/private/pingpp/ect_rsa_private_key.pem');
    switch (channel) {
      case 'alipay_pc_direct':
        // 支付宝网页支付
        extra = {
          success_url: `${http_}://${this.http.host}/account/pay/payres`
        };

        break;
      case 'wx_pub_qr':
        // 微信网pc页扫码支付
        extra = {
          limit_pay: null, product_id: order_no
        };

        break;
      case 'alipay_qr':
        // 支付宝PC网页扫码支付
        break;
      case 'upacp_pc':
        // 网银pc网页支付
        extra = {
          result_url: `${http_}://${this.http.host}/account/pay/payres`
        };
        break;
      case 'upacp_wap':
        // 网银pc网页支付
        extra = {
          result_url: `${http_}://${this.http.host}/account/pay/payres`
        };
        break;
      case 'alipay_wap':
        // 支付宝网页支付
        extra = {
          success_url: `${http_}://${this.http.host}/account/pay/payres`
        };

        break;
      case 'bfb_wap':
        // 支付宝网页支付
        extra = {
          result_url: `${http_}://${this.http.host}/account/pay/payres`,
          bfb_login: false
        };

        break;
      case 'wx_pub':
        // 微信公共账号支付
        extra = {
          open_id: open_id
        };
        break;
    }

    config = {
      subject: '网站订单支付',
      body: '网站订单支付',
      amount: amount,
      order_no: order_no,
      channel: channel,
      currency: 'cny',
      client_ip: ip,
      app: {id: setup.PINGXX_APP_ID},
      extra: extra
    };
    console.log('[create pingpp config]', config);
    function create(pingpp, config) {
      const deferred = think.defer();
      pingpp.charges.create(config, function(err, charge) {
        console.log(`[create pingpp error with config: ${JSON.stringify(config)}]`, err);
        deferred.resolve(charge);
      });
      return deferred.promise;
    }

    return await create(pingpp, config);
  }

  async getPingxx(id) {
    const setup = await think.config('settings');
    const pingpp = require('pingpp')(setup.PINGXX_LIVE_SECRET_KEY);
    pingpp.setPrivateKeyPath(think.ROOT_PATH + '/private/pingpp/ect_rsa_private_key.pem');
    function retrieve(pingpp, id) {
      const deferred = think.defer();
      pingpp.charges.retrieve(id, function(err, charge) {
        console.log(`[retrieve pingpp error with id: ${id}]`, err);
        deferred.resolve(charge);
      }
      );
      return deferred.promise;
    }

    const res = await retrieve(pingpp, id);
    // console.log(res);
    return res;
  }

  async createPaypal(order_no, order_amount, order_id, uuid) {
    var create_payment_json = {
      "intent": "sale",
      "payer": {
        "payment_method": "paypal"
      },
      "transactions": [
        {
          "amount": {
            "total": await this.convertCurrency(order_amount),
            "currency": "USD",
            "details": {}
          },
          "description": "详情请返回原网站查看",
          "custom": uuid,
          // "invoice_number": '11111', // todo: change
          "payment_options": {
            "allowed_payment_method": "INSTANT_FUNDING_SOURCE"
          },
          // "soft_descriptor": '111',
          "item_list": {}
        }
      ],
      "note_to_payer": "订单有误请联系我们", // todo: 联系方式
      "redirect_urls": {
        // 返回样例: https://example.com/return?paymentId=PAY-6UY36477MH0684541LKUJP5Y&token=EC-55Y65963TJ803122J&PayerID=9TYCTE7EQNDMY
        "return_url": `${this.http_}://${this.http.host}/account/pay/payres`,
        "cancel_url": `${this.http_}://${this.http.host}/account/pay/index?order=${order_no}`
      }
    };

    const create = () => {
      const deferred = think.defer();
      paypal.payment.create(create_payment_json, (error, payment) => {
        if (error) {
          console.log(`[create paypal error with config: ${JSON.stringify(create_payment_json)}]`, JSON.stringify(error));
          deferred.reject(error)
        } else {
          deferred.resolve(this.formatPayPalRes(payment));
        }
      });

      return deferred.promise;
    }

    const payment =  await create();

    return payment
  }

  async getPaypal(paymentId) {
    const deferred = think.defer();
    paypal.payment.get(paymentId, (error, payment) => {
      if (error) {
        console.log(`[get paypal error with id: ${paymentId}]`, error);
        deferred.reject(error)
      } else {
        // console.log('------------------get payment res', JSON.stringify(payment));
        deferred.resolve(this.formatPayPalRes(payment));
      }
    });
    return deferred.promise;
  }

  async excutePaypal(channel, paymentId, payerId, orderNo) {
    var execute_payment_json = {
      "payer_id": payerId,
    };

    const excute = () => {
      const deferred = think.defer();
      paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
        if (error) {
          console.log(`[execute paypal error with id: ${paymentId}]`, error);
          // deferred.reject(error)
          if (error.response.name === 'PAYMENT_ALREADY_DONE') {
            const paymentInfo = await this.getPaypal(paymentId)
            deferred.resolve({
              paid: true,
              time_paid: moment(paymentInfo.create_time).unix(),
              order_no: orderNo,
              amount: await this.convertCurrency(_.get(paymentInfo, 'transactions[0].amount.total') * 100), //单位：分
              channel
            });
          }
        } else {
          // console.log('------------------execute payment res', JSON.stringify(payment));
          deferred.resolve({
            paid: true,
            time_paid: moment().unix(),
            order_no: orderNo,
            amount: await this.convertCurrency(_.get(payment, 'transactions[0].amount.total') * 100), //单位：分
            channel
          });
        }
      });

      return deferred.promise;
    }

    const payment =  await excute();

    return payment
  }

  formatPayPalRes (payment) {
    const approval_url = _.find(payment.links, {rel: 'approval_url'})
    return {
      ..._.pick(payment, ['id', 'transactions']),
      url: _.get(approval_url, 'href')
    }
  }

  async convertCurrency (amount) {
    // todo: 汇率转换：https://www.nowapi.com/?app=intf.appkey
    return amount
  }
};
