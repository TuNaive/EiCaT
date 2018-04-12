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
      company: [ '助芯通 TSPCBA' ],
      placeholder: [ '请输入' ],
      companyProfile: [ '公司介绍' ],
      coreBusiness: [ '核心业务' ],
      contactInfo: [ '联系方式' ]
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
      delivery: [ '即时响应' ],
      deliveryText: [ '仅需简单参数输入，即可在线报价下单，按时完成复杂产品交付。' ],
      quality: [ '品质保障' ],
      qualityText: [ '严格执行品质管理体系，超越客户品质需求，尽善尽美，持续改善。' ],
      professional: [ '专业团队' ],
      professionalText: [ '资深的工程师团队，先进的工厂设备及工作环境，成就完美产品，非凡体验。' ],
      economy: [ '高性价比' ],
      economyText: [ '提供高性价比产品，优化客户产品成本，达到满足产品质量需求的降成本目标。' ],
      poh1: [ '1. 根据您的所需，填写下面相关内容，系统会匹配出相关价格；' ],
      poh2: [ '2. 自助询价适用于1-8层，30平米以下的普通硬板报价，其它类型请选择人工报价；' ],
      poh3: [ '3. 阻抗、塞孔、厚铜、盲埋孔、高Tg，高CTI等参数不在选项范围内或有特殊工艺要求的，请选择工程师人工报价。' ],
      pos1: [ '填写所需询价信息' ],
      pos2: [ '生成PCB报价单' ],
      pos3: [ '上传PCB文件，提交订单' ],
      paoh1: [ '1. 根据您的所需，填写下面相关内容，系统会匹配出相关价格' ],
      paoh2: [ '2. 本自助询价适用于1000套以下的样板小批量的报价；量大请选择人工报价，有更多优惠哦' ],
      paoh3: [ '3. 洗板费、测试费要根据板子要求和测试难度而定，如果洗板要求特殊、测试复杂的，要酌情增加收费' ],
      paoh4: [ '4. 贴片总点数（不含DIP脚数）&gt;500点的样板，请选择人工报价。板子数量少于500pcs即为样板' ],
      paos1: [ '填写所需询价信息' ],
      paos2: [ '生成PCBA报价单' ],
      paos3: [ '上传PCBA文件，提交订单' ],
      paChipPoint: [ 'CHIP点数' ],
      paChipPointHint: [ 'L.C.R一个元器件算一个点；二三极管、钽电容算两个点。' ],
      paChipPointError: [ '请输入正确的CHIP点数' ],
      paIcPoint: [ 'IC点数' ],
      paicPointHint: [ '多引脚元器件4个脚算一点。' ],
      paIcPointError: [ '请输入正确的IC点数' ],
      paBgaPoint: [ 'BGA点数' ],
      paBgaPointHint: [ 'BGA 4个脚算一点。' ],
      paBgaPointError: [ 'CHIP+IC+BGA总点数要小于500点，大于请转人工' ],
      paDipPoint: [ 'DIP脚数' ],
      paDipPointHint: [ '插件器件一个脚算一个点。' ],
      paDipPointError: [ 'DIP脚数0~1000' ],
      paMeshSize: [ '钢网尺寸' ],
      paMeshSizeHint: [ '样板钢网尺寸=PCB板子长宽各加100mm以上（用于手工印刷）批量板要选大于420*520mm的钢网尺寸（用于自动印刷机）' ],
      paOrderQuantity: [ '订单数量' ],
      paOrderQuantityError: [ '请输入正确的订单数量' ],
      paDelivery: [ '交期' ],
      paDeliveryHint: [ '样板小批量交期一般2-3天，批量贴片正常交期3天+插件正常交期3天；如需加急请提前48小时通知。' ],
      paRemark: [ '备注' ],
      paRemarkError: [ '请填写备注信息' ],
      pacdTitle: [ '* 客户须提供资料：' ],
      pacd1: [ '详细、准确的BOM清单，如有变更须在BOM上注明（必须提供）' ],
      pacd2: [ 'Gerber文件，如需开拼版钢网，请提供拼版文件' ],
      pacd3: [ '元器件位号图(Reference Designator)' ],
      pacd4: [ '坐标文件(Pick Place file)' ],
      pacd5: [ 'PCB文件（如果坐标文件、位号图、Gerber文件客户未能导出的，也可提供PCB文件）' ],
      pacd6: [ '样板（生产参照用，有条件的可提供）' ],
      parmcTitle: [ '* 原材料及原材料损耗：' ],
      parmc1: [ '样品/小批量订单：单品加工批量小于等于500PCS的损耗不计（尽量按5%以上提供备品），IC等贵重物料不包含在内，PCB尽量多给2-3pcs' ],
      parmc2: [ '首次批量订单（>500pcs）损耗：' ],
      parmc2_1: [ '电子料：便宜的容阻件按3%-4%损耗计算；CHIP(0402) 按1.5%损耗计算；CHIP0603/0805/1206以及二、三极管按1%损耗计算。' ],
      parmc2_2: [ '贵重元器件来料不良1:1更换' ],
      parmc2_3: [ 'PCB以1:1更换，尽量多提供几pcs备品' ],
      parmc2_4: [ '原包装少数（双方抽点原包装为准）由贵司补数。' ],
      parmc3: [ '稳定后批量加工物料损耗率约为0.3%-0.5%' ],
      parmc4: [ '如少量物料备不齐，暂无需焊接，请列出明细' ],
      parmc5: [ '有特殊要求、注意事项，请提前说明' ]
    },
    "aboutus": {
      "": {
        "domain": "aboutus",
        "lang": "cn",
        "plural_forms": "nplurals=1; plural=(n != 1);"
      },
      introduction: [ '公司介绍' ],
      cp1: [ `助芯通是一家专业的PCBA整体方案创新平台，
        为世界各地的客户提供一站式服务包括PCB布板、PCB生产、料件采购、PCBA组装、非标定制、供应链管理外包服务、系统集成和测试，
        全方位满足新兴领域中小电子企业对即时响应、缩短开发周期、竞争性产品成本、最佳预算匹配的高性能产品等多元化需求，
        助力客户产品快速上市。`],
      cp2: [`核心业务涵盖“PCB/PCBA在线报价下单、非标器件/方案定制、供应链管理外包服务”，
        通过全球供应链管理、企业资源规划(ERP)、精益质量管理等方面实施持续改进过程，
        实现最好的客户体验。` ],
      ppoo: [ 'PCB/PCBA在线报价下单' ],
      ppoo1: [ '满足客户对PCB设计->PCB制版->元器件采购->PCBA贴片->整机组装测试的一站式需求。' ],
      ppoo2: [ '提供PCB、FPC、刚挠结合板的设计、在线报价下单、快速交付。' ],
      ppoo3: [ '提供小批量PCBA在线报价下单、快速交付。' ],
      ppoo4: [ '同时提供中大批量的PCB生产、PCBA贴片、插件、手工焊接、组装、测试等服务。' ],
      ppoo5: [ '通过ISO9001/TS16949认证。' ],
      customize: [ '非标器件/方案定制' ],
      customize1: [ '帮助世界各地电子产品企业寻找高性价比物料替代，以优化产品成本，达到满足产品质量需求的降成本目标。' ],
      customize2: [ `以全球化的资源信息和客户需求数据为基础，结合优选物料团队的技术服务能力、
        供应链团队的物料采购经验和销售团队的服务经验，实现电子制造企业高性价比物料优选。` ],
      customize3: [ '提供产品/系统方案设计服务，专注智能硬件、汽车电子、智能电表、能源管理系统的方案开发服务。' ],
      sl: [ '供应链管理外包服务' ],
      sl1: [ '根据客户的需求和概念制造样品。' ],
      sl2: [ '样品确认后，提供从料件采购、加工生产、到国内外分销的高度整合服务。' ],
      sl3: [ '帮助客户打造贯穿客户产业的从方案商到原材料供应商、从制造商到渠道商的完整的供应链体系。' ],
      sl4: [ '为客户节约生产基建投资、设备购置费用以及工人人工费用，集中资源投入到高附加值的产品设计和市场营销' ],
      sl5: [ '整合企业生产资源，以最小投入产生最大产出，提升企业核心竞争力。' ]
    }
  }
}
