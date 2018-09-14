import Base from './base.js'

const crypto = require('crypto');
const fs = require('fs');
export default class extends Base {
  __before() {
    return super.__before().then(data => {
      this.channel = '支付'
      this.$locale = _.get(this.getLocale(), '0')
      this.isZh = !(this.$locale === 'en-us')
      return data
    })
  }
  // 支付
  async indexAction() {
    let payOnline = await this.model('setting').getPayOnline() == 1
    this.assign('currency', this.isZh ? '￥' : '$')
    if (this.isAjax('post')) {
      let payment;
      let pay;
      let charges;
      const post = this.post();
      // 获取订单信息
      //todo: order_no 数据库更改
      const order = await this.model('order').where({pay_status: 0, user_id: this.user.uid}).find(post.order_id);
      if (think.isEmpty(order)) {
        return this.fail('订单不存在！');
      }
      payOnline = this.model('order').isShopOrder(order.type) ? true : payOnline

      // 支付日志
      const receiving = {
        order_id: post.order_id,
        user_id: this.user.uid,
        amount: order.order_amount,
        create_time: new Date().getTime(),
        payment_time: new Date().getTime(),
        doc_type: 0,
        pay_status: 0
      };

      const orderUpdate = {}

      if (!payOnline) {
        orderUpdate.pay_code = post.payment
        receiving.pay_status = orderUpdate.pay_status = 1
        post.payment = 1002 // 线下付款
      }

      receiving.payment_id = orderUpdate.payment = post.payment

      // 更新订单的支付方式
      await this.model('order').where({id: order.id}).update(orderUpdate);
      
      // 100预付款支付
      if (post.payment == 100) {
        // 先检查下用户余额
        const balance = await this.model('member').where({user_id: this.user.uid}).getField('amount', true);
        if (Number(balance) < Number(order.order_amount)) {
          return this.fail('您余额不足，请充值，或者选择其他支付方式！');
        } else {
          // 扣款
          const decrement = this.model('member').where({user_id: this.user.uid}).decrement('amount', Number(order.order_amount));
          if (decrement) {
            // 扣款成功改变订单状态
            // await this.model('order').where({order_no: order.order_no}).update({status: 3, pay_status: 1});

            // 扣款成功后插入日志
            const log = {
              admin_id: 0,
              user_id: this.user.uid,
              type: 2,
              time: new Date().valueOf(),
              amount: (0 - Number(order.order_amount)),
              amount_log: await this.model('member').where({id: this.user.uid}).getField('amount', true),
              note: `${await get_nickname(this.user.uid)} 通过余额支付方式进行商品购买,订单编号：${order.order_no}`
            };
            await this.model('balance_log').add(log);
            receiving.pay_status = 1;
            await this.model('doc_receiving').add(receiving);
            const url = `/account/pay/payres/?c_o_id=${post.order_id}`;
            return this.success({name: '支付订单对接成功，正在转跳！', url: url});
          } else {
            return this.fail('您没有要支付的订单');
          }
        }
      }

      // 1001货到付款
      if (post.payment == 1001) {
        const url = `/account/pay/payres/?c_o_id=${post.order_id}`;
        return this.success({name: '支付订单对接成功，正在转跳！', url: url});
      }

      // 1002线下付款
      if (post.payment == 1002) {
        await this.model('doc_receiving').add(receiving);
        const url = `/account/pay/payres/?c_o_id=${post.order_id}`;
        return this.success({name: '支付订单对接成功，正在转跳！', url: url});
      }

      if (think.isEmpty(order)) {
        return this.fail('您没有要支付的订单');
      } else {
        const channel = await this.model('pingxx').where({id: post.payment}).getField('channel', true);
        // 判断是否已经绑定pingxx_id,如果已绑定查询pingxx订单直接支付。防止订单重复生成。
        if (think.isEmpty(order.pingxx_id)) {
          // console.log(111111111)
          // 获取渠道
          let open_id;
          if (channel == 'wx_pub') {
            open_id = await this.session('wx_openid');
          }
          // 调用ping++ 服务端
          payment = think.service('account/payment', this.ctx);
          // 传入 channel,order_no,order_amount,this.ip()
          if (channel == 'paypal') {
            charges = await payment.createPayment(channel, order.order_no, order.order_amount, post.order_id, this.user.uid);
          } else {
            charges = await payment.createPayment(channel, order.order_no, order.order_amount, this.ip, open_id);
          }

          // 把pingxx_id存到订单
          await this.model('order').where({id: post.order_id}).update({pingxx_id: charges.id});
        } else {
          // console.log(33333333);
          // 调用ping++ 服务端
          payment = think.service('account/payment', this.ctx);
          charges = await payment.getPayment(channel, order.pingxx_id);
        }
        // console.log(charges);
        if (charges) {
          await this.model('doc_receiving').add(receiving);
          return this.success({name: '支付订单对接成功，正在转跳！', data: charges});
        } else {
          return this.fail('调用接口失败！');
        }
      }
    } else {
      const order_id = this.get('order');
      // 订单信息
      const order = await this.model('order').where({pay_status: 0, user_id: this.user.uid}).find(order_id);
      if (think.isEmpty(order)) {
        const error = this.controller('common/error');
        return error.noAction('订单不存在或者已经支付！');
      }
      payOnline = this.model('order').isShopOrder(order.type) ? true : payOnline

      order.end_time = moment(order.create_time + (Number(this.config('setup.ORDER_DELAY')) * 60000));
      // console.log(order);
      this.assign('order', order);

      //   //支付方式
      // let paylist = await this.model("payment").where({status:1}).order("sort ASC").select();
      // for(let val of paylist){
      //      val.logo =  await this.model("pay_plugin").where({id:val.plugin_id}).getField("logo",true);
      //   }
      //   this.assign("paylist",paylist);

      if (payOnline) {
        // 根据不同的客户端调用不同的支付方式
        let map;
        if (!this.isZh) {
          map = {
            type: 4,
            status: 1
          };
        } else if (this.isMobile) {
          map = {
            type: 2,
            status: 1
          };
          if (!this.isweixin) {
            map.channel = ['!=', 'wx_pub'];
          } else {
            map.channel = ['!=', 'alipay_wap'];
          }
        } else {
          map = {
            type: 1,
            status: 1
          };
        }
        const paylist = await this.model('pingxx').where(map).order('sort ASC').select();
        this.assign('paylist', paylist);
      }

      this.assign('payOnline', payOnline);
      this.meta_title = '订单支付';// 标题1
      this.keywords = this.config('setup.WEB_SITE_KEYWORD') ? this.config('setup.WEB_SITE_KEYWORD') : '';// seo关键词
      this.description = this.config('setup.WEB_SITE_DESCRIPTION') ? this.config('setup.WEB_SITE_DESCRIPTION') : '';// seo描述

      return this.display();
    }
  }
  // Webhooks
  async webhooksAction() {
    const data = this.post();
    // 验证 webhooks 签名
    var verify_signature = function(raw_data, signature, pub_key_path) {
      var verifier = crypto.createVerify('RSA-SHA256').update(raw_data, 'utf8');
      var pub_key = fs.readFileSync(pub_key_path, 'utf8');
      return verifier.verify(pub_key, signature, 'base64');
    };

    // POST 原始请求数据是待验签数据，请根据实际情况获取
    var raw_data = JSON.stringify(data);
    // 签名在头部信息的 x-pingplusplus-signature 字段
    var signature = this.header('x-pingplusplus-signature');
    // 请从 https://dashboard.pingxx.com 获取「Webhooks 验证 Ping++ 公钥」
    var pub_key_path = think.ROOT_PATH + '/private/pingpp/pingpp_rsa_public_key.pem';

    if (!verify_signature(raw_data, signature, pub_key_path, fs, crypto)) {
      return this.fail('服务器验证失败！');
    }

    switch (data.type) {
      case 'charge.succeeded':
        // 开发者在此处加入对支付异步通知的处理代码
        // console.log(data.data.object.paid);
        if (data.data.object.paid) {
          const order = await this.model('order').where({order_no: data.data.object.order_no}).find();
          // 支付成功改变订单状态
          const update = await this.model('order').where({order_no: data.data.object.order_no}).update({status: 3, pay_status: 1, pay_time: (data.data.object.time_paid * 1000)});
          if (order.type == 1 && update) {
            await this.model('member').where({id: order.user_id}).increment('amount', order.order_amount);
            // 充值成功后插入日志
            const log = {
              admin_id: 0,
              user_id: order.user_id,
              type: 2,
              time: new Date().valueOf(),
              amount: Number(order.order_amount),
              amount_log: await this.model('member').where({id: order.user_id}).getField('amount', true),
              note: `${await get_nickname(order.user_id)} 通过[${await this.model('pingxx').where({id: order.payment}).getField('title', true)}]支付方式进行充值,订单编号：${data.data.object.order_no}`
            };
            await this.model('balance_log').add(log);
          }
          // 记录支付日志
          await this.model('doc_receiving').where({order_id: order.id}).update({pay_status: 1, payment_time: (data.data.object.time_paid * 1000)});
          this.success({name: '成功！'});
        } else {
          this.fail('失败！');
        }
        break;
      case 'refund.succeeded':
        // 开发者在此处加入对退款异步通知的处理代码sfdsfs
        break;
      default:
    }
  }
  // 支付回调
  async payresAction() {
    const code = this.get();

    // paypal 回调处理
    if (code.paymentId) {
      code.order_no = await this.model('order').where({pingxx_id: code.paymentId}).getField('order_no', true)
    }

    // 站内支付回调
    if (code.c_o_id) {
      const order = await this.model('order').find(code.c_o_id);
      order.amount = order.order_amount;
      order.channel = await this.controller('admin/order').getPaymentInfo(order.order_no)
      this.assign('order', order);
    } else {
      // 支付接口回掉
      const order = await this.model('order').where({order_no: code.out_trade_no || code.orderId || code.order_no}).find();
      order.channel = await this.controller('admin/order').getPaymentInfo(order.payment)
      // 调用ping++ 服务端
      const payment = think.service('account/payment', this.ctx);
      const charges = await payment.excutePayment(order.channel, order.pingxx_id, code.PayerID, order.order_no);

      if (charges.paid && order.pay_status == 0) { // 未付款
        // 支付成功改变订单状态
        let update = await this.model("order").where({order_no:charges.order_no}).update({status:3,pay_status:1,pay_time:(charges.time_paid*1000)});

        // 充值订单处理逻辑
        // if (order.type == 1 && update) {
        //   await this.model('member').where({id: order.user_id}).increment('amount', order.order_amount);
        //
        //   // 充值成功后插入日志
        //   const log = {
        //     admin_id: 0,
        //     user_id: order.user_id,
        //     type: 2,
        //     time: new Date().valueOf(),
        //     amount: Number(order.order_amount),
        //     amount_log: await this.model('member').where({id: order.user_id}).getField('amount', true),
        //     note: `${await get_nickname(order.user_id)} 通过[${await this.model('pingxx').where({id: order.payment}).getField('title', true)}]支付方式进行充值,订单编号：${order.order_no}`
        //   };
        //   await this.model('balance_log').add(log);
        // }

        // 记录支付日志
        await this.model('doc_receiving').where({order_id: order.id}).update({pay_status: 1, payment_time: (charges.time_paid * 1000)});
      }
      // 充值订单处理逻辑
      // if (charges.paid && order.pay_status == 0 && order.type == 1) {
      //   await this.model('order').where({order_no: order.order_no}).delete();
      // }
      charges.amount = charges.amount / 100;
      charges.channel = await this.model('pingxx').where({channel: charges.channel}).getField('title', true);
      this.assign('order', charges);
    }

    this.meta_title = '支付结果';// 标题1
    this.keywords = this.config('setup.WEB_SITE_KEYWORD') ? this.config('setup.WEB_SITE_KEYWORD') : '';// seo关键词
    this.description = this.config('setup.WEB_SITE_DESCRIPTION') ? this.config('setup.WEB_SITE_DESCRIPTION') : '';// seo描述
    
    return this.display();
  }
};
