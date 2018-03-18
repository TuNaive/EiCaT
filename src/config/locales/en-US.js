module.exports = {
  localeId: 'en-us',
  numeralFormat: {
    delimiters: {
      thousands: ',',
      decimal: '.'
    },
    abbreviations: {
      thousand: 'k',
      million: 'm',
      billion: 'b',
      trillion: 't'
    },
    ordinal: number => {
      let b = number % 10;
      return (~~(number % 100 / 10) === 1) ? 'th' :
        (b === 1) ? 'st' :
        (b === 2) ? 'nd' :
        (b === 3) ? 'rd' : 'th'
    },
    currency: {
      symbol: '$'
    },
    formats: [ // 定义缩写
      { name: 'currency', format: '$ 0,0[.]00' }
    ]
  },
  translation: {
    common: {
      '': {
        domain: 'common',
        lang: 'en',
        plural_forms: 'nplurals=2; plural=(n != 1);'
      },
      navigate: [ 'Navigation' ],
      center: [ 'User Center' ],
      order: [ 'My Orders' ],
      profile: [ 'My Profile' ],
      contact: [ 'ContactUs' ],
      login: [ 'Login' ],
      register: [ 'Register' ],
      logout: [ 'logout' ],
      home: [ 'Home'],
      aboutus: [ 'About Us' ],
      services: [ 'Services' ],
      bom: [ 'BOM RFQ' ],
      map: [ 'Site Map' ],
      address: [ 'Company Address: 199 Haichuan Rd., Jiading District, Shanghai, China, 201800' ],
      phone: [ 'Phone Number: 400-920-5532' ],
      email: [ 'Email Address: sales09@tspcba.com' ],
      copyright: [ 'Copyright' ],
      company: [ '上海融尔电子科技有限公司' ]
    },
    "messages": {
      "": {
        "domain": "messages",
        "lang": "en",
        "plural_forms": "nplurals=2; plural=(n != 1);"
      },
      hi: [ 'Hi' ]
    },
    "hints": {
      "": {
        "domain": "hints",
        "lang": "en",
        "plural_forms": "nplurals=1; plural=(n != 1);"
      },
      pcb: [ 'PCB/PCBA Onling Ordering' ]
    },
    "home": {
      "": {
        "domain": "home",
        "lang": "en",
        "plural_forms": "nplurals=1; plural=(n != 1);"
      },
      hi: [ 'Hi！Glad to have you here' ],
      services: [ 'Our Services' ],
      news: [ 'News' ],
      products: [ 'Products' ],
      links: [ 'Friendly Links' ],
      faq: [ 'FAQ' ],
      login: [ 'Login' ],
      question: [ 'Hi! Any question please send message' ],
      ask: [ 'Send Message' ],
      more: [ 'More' ]
    }
  }
}
