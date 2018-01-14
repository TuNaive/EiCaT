export default [
  ['', '/pcbsvr/index/index', 'get'],
  ['/home', 'home/index/index', 'get'],
  ['/u/avatar',"/center/index/avatar/:1/",'get'],
  ['/u/avatar/:uid',"/center/index/avatar/:1/",'get'],
  ['/pcbsvr', 'pcbsvr/index/index', 'get'],
  ['/pcbsvr/pcb/calc', 'pcbsvr/pcb/calc', 'get'],
  ['/pcbsvr/pcb/enquire', 'pcbsvr/pcb/enquire', 'get'],
  ['/admin', 'admin/index/index', 'get']
]
