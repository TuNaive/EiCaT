module.exports = {
  localeId: 'zh-cn',
  dateFormat: {
    months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
    monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
    weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
    weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
    longDateFormat: {
      LT: 'HH:mm',
      LTS: 'HH:mm:ss',
      L: 'YYYY年MMMD日',
      LL: 'YYYY年MMMD日',
      LLL: 'YYYY年MMMD日Ah点mm分',
      LLLL: 'YYYY年MMMD日ddddAh点mm分',
      l: 'YYYY年MMMD日',
      ll: 'YYYY年MMMD日',
      lll: 'YYYY年MMMD日 HH:mm',
      llll: 'YYYY年MMMD日dddd自定义的格式 HH:mm'
    },
    meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
    meridiemHour: (hour, meridiem) => {
      if (hour === 12) {
        hour = 0
      }
      if (meridiem === '凌晨' || meridiem === '早上' || meridiem === '上午') {
        return hour
      } else if (meridiem === '下午' || meridiem === '晚上') {
        return hour + 12
      } else {
        // '中午'
        return hour >= 11 ? hour : hour + 12
      }
    },
    meridiem: (hour, minute, isLower) => {
      var hm = hour * 100 + minute
      if (hm < 600) {
        return '凌晨'
      } else if (hm < 900) {
        return '早上'
      } else if (hm < 1130) {
        return '上午'
      } else if (hm < 1230) {
        return '中午'
      } else if (hm < 1800) {
        return '下午'
      } else {
        return '晚上'
      }
    },
    calendar: {
      sameDay: '[今天]LT',
      nextDay: '[明天]LT',
      nextWeek: '[下]ddddLT',
      lastDay: '[昨天]LT',
      lastWeek: '[上]ddddLT',
      sameElse: 'L'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(日|月|周)/,
    ordinal: (number, period) => {
      switch (period) {
        case 'd':
        case 'D':
        case 'DDD':
          return number + '日'
        case 'M':
          return number + '月'
        case 'w':
        case 'W':
          return number + '周'
        default:
          return number
      }
    },
    relativeTime: {
      future: '%s内',
      past: '%s前',
      s: '几秒',
      m: '1 分钟',
      mm: '%d 分钟',
      h: '1 小时',
      hh: '%d 小时',
      d: '1 天',
      dd: '%d 天',
      M: '1 个月',
      MM: '%d 个月',
      y: '1 年',
      yy: '%d 年'
    },
    week : {
      // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
      dow: 1, // Monday is the first day of the week.
      doy: 4  // The week that contains Jan 4th is the first week of the year.
    }
  },
  numeralFormat: {
    delimiters: {
      thousands: ',',
      decimal: '.'
    },
    abbreviations: {
      thousand: '千',
      million: '百万',
      billion: '十亿',
      trillion: '兆'
    },
    ordinal: function (number) {
      return '.'
    },
    currency: {
      symbol: '¥'
    },
    formats: [ // 定义缩写
      { name: 'currency', format: '0,0[.]00 $' }
      // numeral(1000).format(currency) === numeral(1000).format('0,0[.]00 $')
    ]
  },
  translation: {
    common: {
      '': {
        domain: 'common',
        lang: 'cn',
        plural_forms: 'nplurals=2; plural=(n != 1);'
      },
      navigate: [ '网站导航' ],
      center: [ '用户中心' ],
      order: [ '我的订单' ],
      profile: [ '账户信息' ],
      contact: [ '联系我们' ],
      login: [ '登录' ],
      register: [ '注册' ],
      logout: [ '注销' ],
      home: [ '首页'],
      aboutus: [ '关于我们' ],
      services: [ '增值服务' ],
      bom: [ 'BOM配单' ],
      map: [ '网站地图' ],
      address: [ '公司地址: 199 Haichuan Rd., Jiading District, Shanghai, China, 201800' ],
      phone: [ '联系电话: 400-920-5532' ],
      email: [ '邮箱地址: sales09@tspcba.com' ],
      copyright: [ '版权所有' ],
      company: [ '上海融尔电子科技有限公司' ]
    },
    "messages": {
      "": {
        "domain": "messages",
        "lang": "cn",
        "plural_forms": "nplurals=1; plural=(n != 1);"
      },
      hi: [ '您好' ]
    },
    "hints": {
      "": {
        "domain": "hints",
        "lang": "cn",
        "plural_forms": "nplurals=1; plural=(n != 1);"
      },
      pcb: [ 'PCB/PCBA 在线下单' ]
    },
    "home": {
      "": {
        "domain": "home",
        "lang": "cn",
        "plural_forms": "nplurals=1; plural=(n != 1);"
      },
      hi: [ '您好！您还未登录，请先登录' ],
      services: [ '公司服务' ],
      s1: [ 'PCB/PCBA在线报价、在线下单' ],
      s2: [ 'PCBA布板、各种板材电路板、柔性电路板、软硬结合电路板生产' ],
      s3: [ 'PCBA焊接、组装、测试' ],
      s4: [ '非标器件/方案定制化' ],
      s5: [ '供应链管理外包服务' ],
      s6: [ '元器件替代、优选' ],
      s7: [ '钣金设计和制造' ],
      s8: [ '背板组装、系统集成' ],
      news: [ '公司新闻' ],
      products: [ '产品展示' ],
      links: [ '友情链接' ],
      address: [ '公司地址' ],
      faq: [ '常见问题' ],
      login: [ '登录' ],
      question: [ '您好！有任何问题欢迎咨询' ],
      ask: [ '咨询' ],
      more: [ '更多' ]
    },
    "smt": {
      "": {
        "domain": "smt",
        "lang": "zh",
        "plural_forms": "nplurals=1; plural=(n != 1);"
      },
      pcb: [ 'PCB 服务' ],
      pcba: [ 'PCBA 服务' ],
      order: [ '在线自助询价' ],
      quote: [ '工程师人工报价' ],
      delivery: [ '交期保障' ],
      quality: [ '品质保障' ],
      professional: [ '专业团队' ],
      economy: [ '经济实惠' ],
      poh1: [ '根据您的所需，填写下面相关内容，系统会匹配出相关价格；' ],
      poh2: [ '自助询价适用于1-8层，30平米以下的普通硬板报价，其它类型请选择人工报价；' ],
      poh3: [ '阻抗、塞孔、厚铜、盲埋孔、高Tg，高CTI等参数不在选项范围内或有特殊工艺要求的，请选择工程师人工报价。' ],
      pos1: [ '填写所需询价信息' ],
      pos2: [ '生成PCB报价单' ],
      pos3: [ '上传PCB文件，提交订单' ]
    }
  }
}
