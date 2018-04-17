export default [
  ['', '/home/index/index', 'get'],
  ['/home', 'home/index/index', 'get'],
  ['/aboutus/profile', 'aboutus/index/profile', 'get'],
  ['/aboutus/business', 'aboutus/index/business', 'get'],
  ['/aboutus/contact', 'aboutus/index/contact', 'get'],
  ['/u/avatar',"/account/index/avatar/:1/",'get'],
  ['/u/avatar/:uid',"/account/index/avatar/:1/",'get'],
  ['/p/:id', "/home/detail/index/:1/",'get'],
  ['/pcbsvr', 'pcbsvr/index/index', 'get'],
  ['/pcbsvr/pcb/calc', 'pcbsvr/pcb/calc', 'get'],
  ['/pcbsvr/pcb/enquire', 'pcbsvr/pcb/enquire', 'get'],
  ['/admin', 'admin/index/index', 'get'],
  ['/search','home/search/index', 'get'],
  ['/:category', '/home/route/index/:1/', 'get']
]
