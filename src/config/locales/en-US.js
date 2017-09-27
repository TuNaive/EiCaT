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
      map: [ 'Site Map' ],
      copyright: [ 'Copyright' ],
      company: [ 'Company Name' ]
    },
    "messages": {
      "": {
        "domain": "messages",
        "lang": "en",
        "plural_forms": "nplurals=2; plural=(n != 1);"
      },
      hi: [ 'Hi' ]
    }
  }
}
