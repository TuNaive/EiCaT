import Base from './base.js'

const FPC_LIST = isZh => {
  return [{
    "id": 1,
    "title": isZh ? "双面软板" : 'Double-sided FPC',
    "src": "/static/common/images/products/FPC1.png"
  }, {
    "id": 2,
    "title": isZh ? "多层软板" : 'Multi-layers FPC',
    "src": "/static/common/images/products/FPC2.png"
  }, {
    "id": 3,
    "title":'Single-sided FPC',
    "src": "/static/common/images/products/FPC3.png"
  }, {
    "id": 4,
    "title": 'Double-sided FPC',
    "src": "/static/common/images/products/FPC4.png"
  }]
}

const FS_LIST = isZh => {
  return [{
    "id": 300,
    "title": isZh ? '软硬结合板' : 'Rigid-Flex Product',
    "src": "/static/common/images/products/FS1.png"
  }, {
    "id": 301,
    "title": isZh ? '软硬结合板' : 'Rigid-Flex Product',
    "src": "/static/common/images/products/FS2.png"
  }, {
    "id": 302,
    "title": 'Rigid-Flex',
    "src": "/static/common/images/products/FS3.png"
  }, {
    "id": 303,
    "title": 'Rigid-Flex',
    "src": "/static/common/images/products/FS4.png"
  }]
}

const PCB_LIST = isZh => {
  return [{
    "id": 304,
    "title": isZh ? '通讯板' : 'Control PCB',
    "src": "/static/common/images/products/PCB1.png"
  }, {
    "id": 305,
    "title": isZh ? '手机板' : 'OSP + BGA PCB',
    "src": "/static/common/images/products/PCB2.png"
  }, {
    "id": 306,
    "title": isZh ? '铝基板' : 'Aluminum Substrate',
    "src": "/static/common/images/products/PCB3.png"
  }, {
    "id": 307,
    "title": isZh ? '高频线路板' : 'HF PCB',
    "src": "/static/common/images/products/PCB4.png"
  }]
}

const PCBA_LIST = isZh => {
  return [{
    "id": 308,
    "title": isZh ? '工控PCBA半成品' : 'Industrial Control PCBA',
    "src": "/static/common/images/products/PCBA1.png"
  }, {
    "id": 309,
    "title": isZh ? 'BGA主板PCBA半成品' : 'BGA Board PCBA',
    "src": "/static/common/images/products/PCBA2.png"
  }, {
    "id": 310,
    "title": isZh ? '通讯板' : 'COMM Main Board',
    "src": "/static/common/images/products/PCBA3.png"
  }, {
    "id": 311,
    "title": isZh ? '通讯板' : 'COMM Main Board',
    "src": "/static/common/images/products/PCBA4.png"
  }]
}

export default class extends Base {
  indexAction() {
    let isZh = !_.isEqual(this.cookie('locale'), 'en-us');
  	this.assign('fpcList', FPC_LIST(isZh));
    this.assign('fsList', FS_LIST(isZh));
    this.assign('pcbList', PCB_LIST(isZh));
    this.assign('pcbaList', PCBA_LIST(isZh));
    return this.display();
  }
}
