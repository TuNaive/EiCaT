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
      s1: [ 'PCB/PCBA online bidding/ordering' ],
      s2: [ 'PCB Layout / PCBs / FPCs / rigid-flex PCBs fabrication' ],
      s3: [ 'PCB Assembly、Testing service' ],
      s4: [ 'Non-standard parts / Solution customization' ],
      s5: [ 'Supply chain management outsourcing service' ],
      s6: [ 'Component replacement proposal and selection' ],
      s7: [ 'Sheet metal design and fabrication' ],
      s8: [ 'Backplane Assembly and System integration' ],
      news: [ 'News' ],
      products: [ 'Products' ],
      links: [ 'Friendly Links' ],
      faq: [ 'FAQ' ],
      login: [ 'Login' ],
      question: [ 'Hi! Any question please send message' ],
      ask: [ 'Send Message' ],
      more: [ 'More' ]
    },
    "smt": {
      "": {
        "domain": "smt",
        "lang": "en",
        "plural_forms": "nplurals=1; plural=(n != 1);"
      },
      pcb: [ 'PCB Services' ],
      pcba: [ 'PCBA Services' ],
      order: [ 'Online Ordering' ],
      quote: [ 'Online Quotation' ],
      delivery: [ 'Delivery Ensurance' ],
      quality: [ 'Quality Assurance' ],
      professional: [ 'Professional' ],
      economy: [ 'Economy & Practical' ],
      poh1: [ 'According to your requirements, fill in the following information and the system will calculate the relevant price' ],
      poh2: [ 'Ordering applied at the 1-8 layer, 30 meters below the ordinary cardboard price' ],
      poh3: [ 'Parameters are not within the scope of the options or have special requirements, please use the Online Quotation' ],
      pos1: [ 'Fill in the required fields' ],
      pos2: [ 'Generate PCB quotation' ],
      pos3: [ 'Upload PCB files, submit your order' ]
    }
  }
}
