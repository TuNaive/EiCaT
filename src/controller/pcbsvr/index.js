import Base from './base.js'

const LIST = [
  {
    "id": 226,
    "uid": 1,
    "name": "",
    "title": "IC板",
    "category_id": 83,
    "group_id": 0,
    "description": "简约卧室吊顶装修效果图大全简约卧室吊顶装修效果图大全简约卧室吊顶装修效果图大全",
    "root": 0,
    "topid": 0,
    "pid": 0,
    "model_id": 5,
    "type": 2,
    "position": 0,
    "link_id": "0",
    "cover_id": 697,
    "display": 1,
    "deadline": 1970,
    "attach": 0,
    "view": 34,
    "comment": 0,
    "extend": 0,
    "level": 0,
    "create_time": 1467801000000,
    "update_time": 1467968706920,
    "status": 1,
    "pics": "",
    "price": "",
    "sort_id": 7,
    "keyname": "0",
    // "src": "//odhs9iog7.qnssl.com/bMBnWf9_8i1G1s-OrS7105M8.jpg?imageView2/1/w/600/h/399"
    "src": "http://fs.digiic.com/download/DownLoadFile?token=&filepath=upload/FreeFile/20161209//IC板_201612091858234604.jpg"
  },
  {
    "id": 225,
    "uid": 1,
    "name": "",
    "title": "双面绿油软板",
    "category_id": 83,
    "group_id": 0,
    "description": "主卧室吊顶装修效果图大全",
    "root": 0,
    "topid": 0,
    "pid": 0,
    "model_id": 5,
    "type": 2,
    "position": 0,
    "link_id": "0",
    "cover_id": 688,
    "display": 1,
    "deadline": 0,
    "attach": 0,
    "view": 19,
    "comment": 0,
    "extend": 0,
    "level": 0,
    "create_time": 1467800485779,
    "update_time": 1467800485779,
    "status": 1,
    "pics": "",
    "price": "",
    "sort_id": 7,
    "keyname": "0",
    // "src": "//odhs9iog7.qnssl.com/bMBnWf9_8i1G1s-OrS7105M8.jpg?imageView2/1/w/600/h/399"
    "src": "http://fs.digiic.com/download/DownLoadFile?token=&filepath=upload/FreeFile/20161209//未标题-5_201612091856501404.jpg"
  },
  {
    "id": 224,
    "uid": 1,
    "name": "",
    "title": "八层蓝油板",
    "category_id": 83,
    "group_id": 0,
    "description": "主卧室吊顶装修效果图大全主卧室吊顶装修效果图大全主卧室吊顶装修效果图大全",
    "root": 0,
    "topid": 0,
    "pid": 0,
    "model_id": 5,
    "type": 2,
    "position": 0,
    "link_id": "0",
    "cover_id": 687,
    "display": 1,
    "deadline": 0,
    "attach": 0,
    "view": 5,
    "comment": 0,
    "extend": 0,
    "level": 0,
    "create_time": 1467800228012,
    "update_time": 1467800228012,
    "status": 1,
    "pics": "",
    "price": "",
    "sort_id": 7,
    "keyname": "0",
    // "src": "//odhs9iog7.qnssl.com/bMBnWf9_8i1G1s-OrS7105M8.jpg?imageView2/1/w/600/h/399"
    "src": "http://fs.digiic.com/download/DownLoadFile?token=&filepath=upload/FreeFile/20161209//未标题-1_201612091856032011.jpg"
  },
  {
    "id": 223,
    "uid": 1,
    "name": "",
    "title": "汽车板",
    "category_id": 83,
    "group_id": 0,
    "description": "简约室内客厅电视背景墙图片大全",
    "root": 0,
    "topid": 0,
    "pid": 0,
    "model_id": 5,
    "type": 2,
    "position": 0,
    "link_id": "0",
    "cover_id": 664,
    "display": 1,
    "deadline": 0,
    "attach": 0,
    "view": 5,
    "comment": 0,
    "extend": 0,
    "level": 0,
    "create_time": 1467799875267,
    "update_time": 1467799875267,
    "status": 1,
    "pics": "",
    "price": "",
    "sort_id": 7,
    "keyname": "0",
    // "src": "//odhs9iog7.qnssl.com/bMBnWf9_8i1G1s-OrS7105M8.jpg?imageView2/1/w/600/h/399"
    "src": "http://fs.digiic.com/download/DownLoadFile?token=&filepath=upload/FreeFile/20161209//未标题-2_201612091900351988.jpg"
  }
]

const PCB_LIST = [{
  "id": 300,
  "title": "8层蓝油板",
  "src": "http://fs.digiic.com/download/DownLoadFile?token=&filepath=upload/FreeFile/20161209//未标题-1_201612091856032011.jpg"
}, {
  "id": 301,
  "title": "六层套板",
  "src": "http://fs.digiic.com/download/DownLoadFile?token=&filepath=upload/FreeFile/20161209//未标题-4_201612091905015577.jpg"
}, {
  "id": 302,
  "title": "双面灰油板",
  "src": "http://fs.digiic.com/download/DownLoadFile?token=&filepath=upload/FreeFile/20161209//未标题-3_201612091901509957.jpg"
}, {
  "id": 303,
  "title": "汽车板",
  "src": "http://fs.digiic.com/download/DownLoadFile?token=&filepath=upload/FreeFile/20161209//未标题-2_201612091900351988.jpg"
}];
const FPC_LIST = [{
  "id": 304,
  "title": "双面绿油软板",
  "src": "http://fs.digiic.com/download/DownLoadFile?token=&filepath=upload/FreeFile/20161209//未标题-5_201612091856501404.jpg"
}, {
  "id": 305,
  "title": "单面软板",
  "src": "http://fs.digiic.com/download/DownLoadFile?token=&filepath=upload/FreeFile/20161209//未标题-1_201612091859564981.jpg"
}, {
  "id": 306,
  "title": "双面软板",
  "src": "http://fs.digiic.com/download/DownLoadFile?token=&filepath=upload/FreeFile/20161209//未标题-4_201612091901202621.jpg"
}, {
  "id": 307,
  "title": "四层软硬结合板",
  "src": "http://fs.digiic.com/download/DownLoadFile?token=&filepath=upload/FreeFile/20161209//未标题-2_201612091902474891.jpg"
}];
const PCBA_LIST = [{
  "id": 308,
  "title": "IC板",
  "src": "http://fs.digiic.com/download/DownLoadFile?token=&filepath=upload/FreeFile/20161209//IC板_201612091858234604.jpg"
}, {
  "id": 309,
  "title": "BGA板",
  "src": "http://fs.digiic.com/download/DownLoadFile?token=&filepath=upload/FreeFile/20161209//未标题-3_201612091859060430.jpg"
}, {
  "id": 310,
  "title": "SMT",
  "src": "http://fs.digiic.com/download/DownLoadFile?token=&filepath=upload/FreeFile/20161209//未标题-4_201612091903353600.jpg"
}, {
  "id": 311,
  "title": "RFID板",
  "src": "http://fs.digiic.com/download/DownLoadFile?token=&filepath=upload/FreeFile/20161209//未标题-5_201612091904373819.jpg"
}];

export default class extends Base {
  indexAction() {
  	this.assign('list', LIST);
    this.assign('pcbList', PCB_LIST);
    this.assign('fpcList', FPC_LIST);
    this.assign('pcbaList', PCBA_LIST);
    return this.display();
  }
}
