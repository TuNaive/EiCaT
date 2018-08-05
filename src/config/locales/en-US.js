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
      guide: [ 'Guide' ],
      terms: [ 'Binding terms and conditions of sale' ],
      statements: [ 'STATEMENT OF PRIVACY' ],
      security: [ 'Data Security' ],
      search: [ 'Search' ],
      cart: [ 'Cart' ],
      cartEmpty: [ 'Cart is Empty' ],
      settle: [ 'Settle' ],
      sum: [ 'Sum' ],
      operation: [ 'QUALITY ASSURANCE' ],
      aboutus: [ 'About Us' ],
      services: [ 'Services' ],
      bom: [ 'BOM RFQ' ],
      scm: [ 'SCM Outsourcing Service' ],
      map: [ 'Site Map' ],
      address: [ 'Company Address: 199 Haichuan Rd., Jiading District, Shanghai, China, 201800' ],
      phone: [ 'Phone Number: 400-920-5532' ],
      email: [ 'Email Address: sales09@tspcba.com' ],
      copyright: [ 'Copyright' ],
      company: [ 'TSPCBA' ],
      placeholder: [ 'Please input' ],
      companyProfile: [ 'Company Profile' ],
      coreBusiness: [ 'Core Business' ],
      contactInfo: [ 'Contact Info' ]
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
      pcb: [ 'PCB Shopping' ],
      pcba: [ 'PCBA Shopping' ],
      order: [ 'Online Ordering' ],
      quote: [ 'Engineer Quickquote' ],
      delivery: [ 'Instant Responses' ],
      deliveryText: [ 'Our online shop turns complex production into a few simple clicks, then on-time delivery.' ],
      quality: [ 'Quality Assurance' ],
      qualityText: [ 'Strive for zero defects to exceed our client requirements, and keep continuous process improvements.' ],
      professional: [ 'Professional Team' ],
      professionalText: [ 'Senior engineer team and advanced equipment to make perfect products and customer experience.' ],
      economy: [ 'Best Cost Performance' ],
      economyText: [ 'Best suitable suppliers and manufacturers for cost reduction and better performance.' ],
      poh1: [ 'We have a simple and easy way to get a quotation through the below tool.' ],
      poh2: [ 'If you have any requirement that are not listed on “Online Ordering” or any items can not be selected or inputted, please select “Engineer Quickquote” button.' ],
      poh3: [ 'We promise that we’ll keep your private information 100% safe.' ],
      pos1: [ 'Fill in the required fields' ],
      pos2: [ 'Generate PCB quotation' ],
      pos3: [ 'Upload PCB files, submit your order' ],
      paoh1: [ '1. We have a simple and easy way to get a quotation through the below tool.' ],
      paoh2: [ '2. If the quantity is large, please select "Engineer Quickquote" button. Then you will get better price.' ],
      paoh3: [ '3. If you have any requirement that are not listed on “Online Ordering” or any items can not be selected or inputted, please select “Engineer Quickquote” button.' ],
      paoh4: [ '4. If you have special requirement, such as testing, the price will be calculated separately.' ],
      paoh5: [ '5. We promise that we’ll keep your private information 100% safe.' ],
      paos1: [ 'Fill in the required fields' ],
      paos2: [ 'Generate PCBA quotation' ],
      paos3: [ 'Upload PCBA files, submit your order' ],
      paChipPoint: [ 'CHIP Points' ],
      paChipPointHint: [ 'one L.C.R component is one point; two or three pole, tantalum capacitors are calculated at two points.' ],
      paChipPointError: [ 'Please input correct CHIP Points' ],
      paIcPoint: [ 'IC Points' ],
      paicPointHint: [ 'For Multi pin components, 4 feet = one point' ],
      paIcPointError: [ 'Please input correct IC Points' ],
      paBgaPoint: [ 'BGA Points' ],
      paBgaPointHint: [ '4 feet = one BGA point' ],
      paBgaPointError: [ 'Please input total CHIP+IC+BGA Points less than 500, or contact us' ],
      paDipPoint: [ 'DIP Feet' ],
      paDipPointHint: [ 'one plugin foot = one DIP foot' ],
      paDipPointError: [ 'Please input correct DIP Points 0~1000' ],
      paMeshSize: [ ' Mesh Size' ],
      paMeshSizeHint: [ 'Model mesh size equals to PCB board length and width plus 100mm (for manual printing). Batch ordering please choose mesh size >420*520mm (for automatic printing machine)' ],
      paOrderQuantity: [ 'Order Quantity' ],
      paOrderQuantityError: [ 'Please input correct Order Quantity' ],
      paDelivery: [ 'Delivery' ],
      paDeliveryHint: [ 'Samll sample batch ordering costs 2-3 days. Batch patch or plugin costs 3 days. Urgent requirements need 48 hours advanced notice' ],
      paRemark: [ 'Remarks' ],
      paRemarkError: [ 'Please input remarks' ],
      pacdTitle: [ '* Customer should provide files:' ],
      pacd1: [ 'BOM,  Gerber files and Panalization drawing if you need us buy stencil for you.' ],
      pacd2: [ 'Components Reference Designator.' ],
      pacd3: [ 'Pick Place file.' ],
      pacd4: [ `Please provide .PCB file if you can't provide the above item1-3.` ],
      pacd5: [ 'PCBA Sample board( if you have it).' ],
      pacd6: [ 'Model sample（For production process. Optional）' ],
      parmcTitle: [ '* Material Consign:' ],
      parmc1: [ 'If <500pcs/batch, please try to provide Reel package with about 5% loss except for IC and large-size components.' ],
      parmc2: [ 'If >500pcs/batch, please make sure you will provide Reel package with about 1.5%~3% loss except for IC and large-size components.' ],
      parmc2_1: [ 'Electronic material: the low volume resistance parts according to 3%-4% loss calculation; CHIP (0402) according to the calculation of the loss of, and CHIP0603/0805/1206, two, transistor according to the calculation of the loss.' ],
      parmc2_2: [ 'Valuable components into the bad 1:1 replacement.' ],
      parmc2_3: [ 'PCB to 1:1 replacement, as many as possible to provide a few spare pcs.' ],
      parmc2_4: [ 'A small number of original packaging (both sides of the original point of the original packaging) by the number of your company.' ],
      parmc3: [ 'The material loss rate of mass production is about 0.3%~0.5%.' ],
      parmc4: [ 'Please list them in the remark if you have any special requirements.' ],
      parmc5: [ 'Special requirements, attention, please explain in advance' ]
    },
    "aboutus": {
      "": {
        "domain": "aboutus",
        "lang": "en",
        "plural_forms": "nplurals=1; plural=(n != 1);"
      },
      title: [ 'About Us' ],
      introduction: [ 'Company Profile' ],
      business: [ 'Core Business' ],
      assurance: [ 'Quality Assurance' ],
      cp1: [ `TSPCBA is a professional PCBA turnkey solution 
        innovation platform. We offer one-shop services including PCB layout, 
        PCB fabrication, material procurement, PCB assembly, 
        non-standard customization, supply chain management outsourcing, 
        box building and testing. We also offer value-added services 
        to meet our customers' diversified demands of instant responses, 
        shorter development cycles, competitive pricing, high performance products.`],
      cp2: [`Our core business covers “PCB/PCBA online ordering, 
        Non-standard parts/solution customization, 
        Supply chain management outsourcing service”. 
        We believe continuous improvement process will achieve the best customer experience.` ],
      ppoo: [ 'PCB/PCBA online ordering' ],
      ppoo1: [ `Meet customers' one-stop demands from PCB layout to finished goods delivery.` ],
      ppoo2: [ 'Provide PCB, FPC, rigid-flex PCB, online bidding /ordering, then quick delivery.' ],
      ppoo3: [ 'Provide small batches of PCBA online bidding /ordering, then quick delivery.' ],
      ppoo4: [ 'Also provide mass production for PCB/PCBA, SMT, assembly, box building and testing.' ],
      ppoo5: [ 'ISO9001/TS16949 certification.' ],
      customize: [ 'Non-standard parts / solution customization' ],
      customize1: [ 'Assist our customer to search parts replacement achieve cost-reduction target and quality assurance.' ],
      customize2: [ `Realize electronic manufacturer cost-effective based on our globalization resource information, 
        customer demand data and our team professional experience.` ],
      customize3: [ 'Provide electronic products/system design services , focus on smart hardware, automotive electronics, smart meters, and energy management system.' ],
      sl: [ 'Supply chain management outsourcing service' ],
      sl1: [ 'Making samples according to customer requirements and product concepts.' ],
      sl2: [ 'Provide high integration services from material purchasing, processing and production to domestic and international distribution.' ],
      sl3: [ 'Help our customers to establish a complete supply chain system from manufacturers to distributors.' ],
      sl4: [ 'Assist our customers to save fixed investment, focus on high value-added products R&D and market development.' ],
      sl5: [ 'Achieve the minimum input and maximize output to improve core competitiveness of enterprises.' ],
      as1: [ '从供应链管理至分销管理至运输，TSPCBA对售出的元件进行全方位追踪。' ],
      as2: [ '我们致力于满足您对准时交付高性价比产品的要求。 我们的使命是成为产品研发及采购人员最信赖的供货渠道，助力中小客户提供最优质的零部件，产品快速上市。' ],
      as3: [ '如果您对我们的质量管理体系有任何疑问，请随时与我们的相关人员联系：' ]
    }
  }
}
