import _ from 'lodash'
import moment from 'moment'
import NP from 'number-precision'
import accounting from 'accounting'

moment.locale('zh-cn')

global._ = _

global.moment = moment

global.NP = NP

global.showDebug = messages => {
  console.log('\n=========== Debug ===========')
  console.log(_.toString(messages), '\n')
}

global.encryptPassword = (password, md5encoded = false) => {
  password = md5encoded ? password : think.md5(password)
  // todo: test admin
  return think.md5(think.md5('whatthefuck') + password + think.md5('isthis'))
  // return think.md5(think.md5('www.cmswing.com') + password + think.md5('Arterli'));
}

global.toHierarchy = (data, pid = 0) => {
  const rtn = []
  for (let idx = 0, len = data.length; idx < len; idx++) {
    let dr = data[idx]
    if (dr.pid === pid) {
      dr.children = toHierarchy(data, dr.id)
      rtn.push(dr)
    }
  }
  return rtn
}

global.arrayContains = (arr, str) => {
  for (let idx = 0, len = arr.length; idx < len; idx++) {
    if (_.toString(str) === _.toString(arr[idx])) {
      return true
    }
  }
  return false
}

/**
 * ip转数字
 * @param ip
 * @returns {number}
 * @private
 */
global._ip2int = function(ip) {
  var num = 0;
  ip = ip.split('.');
  num = Number(ip[0]) * 256 * 256 * 256 + Number(ip[1]) * 256 * 256 + Number(ip[2]) * 256 + Number(ip[3]);
  num = num >>> 0;
  return num;
};

/**
 * 数字转ip
 * @param num
 * @returns {string|*}
 * @private
 */
global._int2iP = function(num) {
  var str;
  var tt = new Array();
  tt[0] = (num >>> 24) >>> 0;
  tt[1] = ((num << 8) >>> 24) >>> 0;
  tt[2] = (num << 16) >>> 24;
  tt[3] = (num << 24) >>> 24;
  str = String(tt[0]) + "." + String(tt[1]) + "." + String(tt[2]) + "." + String(tt[3]);
  return str;
}

/**
 * 把返回的数据集转换成Tree
 * @param array data 要转换的数据集
 * @param string pid parent标记字段
 * @return array
 */
global.arr_to_tree = function(data, pid) {
  var result = [], temp;
  var length = data.length;
  for (var i = 0; i < length; i++) {
    if (data[i].pid == pid) {
      result.push(data[i]);
      temp = arr_to_tree(data, data[i].id);
      if (temp.length > 0) {
        data[i].children = temp;
        data[i].chnum = data[i].children.length;
      }
    }
  }
  return result;
};

/**
 *根据uid获取用户昵称
 * @param uid 用户id
 * @returns Promise {*}
 */
global.get_nickname = async(uid) => {
  // console.log(uid);
  // let data = await think.model('member', think.config("model")).cache(1000).get_nickname(uid);
  const data = await think.model('member').get_nickname(uid);
  return data;
};

/**
 * in_array
 * @param stringToSearch
 * @param arrayToSearch
 * @returns {boolean}
 */
global.in_array = function(stringToSearch, arrayToSearch) {
  for (let s = 0; s < arrayToSearch.length; s++) {
    let thisEntry = arrayToSearch[s].toString();
    if (thisEntry == stringToSearch) {
      return true;
    }
  }
  return false;
}

/**
 * 返回一个自定义用户函数给出的第一个参数
 *  call_user_func（回调 函数名， [参数]）
 * @param cb  函数名
 * @param params 数组格式传入参数
 */
global.call_user_func = function(cb, params) {
  let func = eval(cb);
  if (!think.isArray(params)) {
    params = [params];
  }
  return func.apply(cb, params);
}

/*
* 时间格式
* */
global.time_format = (time) => {
  return moment(time).format('YYYY-MM-DD HH:mm:ss');
}

/* global str_replace()
 * str_replace(条件[]，替换内容[],被替换的内容)
 * @param search
 * @param replace
 * @param subject
 * @param count
 * @returns {*}
 */
global.str_replace = function(search, replace, subject, count) {
  var i = 0, j = 0, temp = '', repl = '', sl = 0, fl = 0,
    f = [].concat(search),
    r = [].concat(replace),
    s = subject,
    ra = r instanceof Array, sa = s instanceof Array;
  s = [].concat(s);
  if (count) {
    this.window[count] = 0;
  }

  for (i = 0, sl = s.length; i < sl; i++) {
    if (s[i] === '') {
      continue;
    }
    for (j = 0, fl = f.length; j < fl; j++) {
      temp = s[i] + '';
      repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
      s[i] = (temp).split(f[j]).join(repl);
      if (count && s[i] !== temp) {
        this.window[count] += (temp.length - s[i].length) / f[j].length;
      }
    }
  }
  return sa ? s : s[0];
}

/* global arr_to_tree */
global.sub_cate = function(data, pid) {
  var result = [], temp;
  var length=data.length;
  for(var i=0;i<length;i++) {
    if (data[i].pid == pid) {
      //console.log(data[i]);
      result.push(data[i].id);
      temp = sub_cate(data, data[i].id);
      if (temp.length > 0) {
        result.push(temp.join(','));
      }
    }
  }
  return result;
}

/**
 *
 * 根据栏目ID获取栏目信息
 * @param cid
 * @returns {*}
 */
global.get_cate=async(cid)=>{
  let column = await think.model('category').get_all_category();

  for(let v of column){
    if(v.id==cid){
      // console.log(v)
      return v;
    }
  }
}

/**
 * 数组去重
 * @param arr
 * @returns {Array}
 */
global.unique = function(arr) {
  // var result = [], hash = {};
  // for (var i = 0, elem; (elem = arr[i]) != null; i++) {
  //     if (!hash[elem]) {
  //         result.push(elem);
  //         hash[elem] = true;
  //     }
  // }
  // return result;
  return Array.from(new Set(arr));
}

/**
 * 获取文档地址
 * @param name 文档表示
 * @param id   文档id
 * @returns {*}
 */
global.get_url = (name, id) => {

  if (!think.isEmpty(name)) {
    return `/p/${name}.html`;
  } else {
    return `/p/${id}.html`;
  }
}

/**
 *
 * @param id
 * @param m
 * /0/w/<LongEdge>/h/<ShortEdge>  限定缩略图的长边最多为<LongEdge>，短边最多为<ShortEdge>，进行等比缩放，不裁剪。如果只指定 w 参数则表示限定长边（短边自适应），只指定 h 参数则表示限定短边（长边自适应）。
 * /1/w/<Width>/h/<Height>  限定缩略图的宽最少为<Width>，高最少为<Height>，进行等比缩放，居中裁剪。转后的缩略图通常恰好是 <Width>x<Height> 的大小（有一个边缩放的时候会因为超出矩形框而被裁剪掉多余部分）。如果只指定 w 参数或只指定 h 参数，代表限定为长宽相等的正方图。
 * /2/w/<Width>/h/<Height>  限定缩略图的宽最多为<Width>，高最多为<Height>，进行等比缩放，不裁剪。如果只指定 w 参数则表示限定宽（长自适应），只指定 h 参数则表示限定长（宽自适应）。它和模式0类似，区别只是限定宽和高，不是限定长边和短边。从应用场景来说，模式0适合移动设备上做缩略图，模式2适合PC上做缩略图。
 * /3/w/<Width>/h/<Height>  限定缩略图的宽最少为<Width>，高最少为<Height>，进行等比缩放，不裁剪。如果只指定 w 参数或只指定 h 参数，代表长宽限定为同样的值。你可以理解为模式1是模式3的结果再做居中裁剪得到的。
 * /4/w/<LongEdge>/h/<ShortEdge>  限定缩略图的长边最少为<LongEdge>，短边最少为<ShortEdge>，进行等比缩放，不裁剪。如果只指定 w 参数或只指定 h 参数，表示长边短边限定为同样的值。这个模式很适合在手持设备做图片的全屏查看（把这里的长边短边分别设为手机屏幕的分辨率即可），生成的图片尺寸刚好充满整个屏幕（某一个边可能会超出屏幕）。
 * /5/w/<LongEdge>/h/<ShortEdge>  限定缩略图的长边最少为<LongEdge>，短边最少为<ShortEdge>，进行等比缩放，居中裁剪。如果只指定 w 参数或只指定 h 参数，表示长边短边限定为同样的值。同上模式4，但超出限定的矩形部分会被裁剪。
 * @param w 宽
 * @param h 高
 */
global.get_pic = async (id, m = null, w = null, h = null) => {
  if (think.isEmpty(id)) {
    return "/static/noimg.jpg";
  }
  let map = {};
  map.status = 1;
  if (think.isNumberString(id)) {
    map.id = id;
  } else {
    map.path = id;
  }
  let picture = await think.model('picture').where(map).find();
  if (think.isEmpty(picture)) {
    return "/static/noimg.jpg";
  }
  let q = "";
  if (picture.type > 0) {
    if (m != null) {
      m = "/" + m
    } else {
      m = ""
    }
    if (w != null) {
      w = "/w/" + w
    } else {
      w = ""
    }
    if (h != null) {
      h = "/h/" + h
    } else {
      h = ""
    }
    if (m != "" || w != "" || h != "") {
      q = `?imageView2${m}${w}${h}`
    }

    return `//${think.config('settings.QINIU_DOMAIN_NAME')}/${picture.path}${q}`;
  } else {
    return picture.path
  }
}

/**
 * 获取价格格式化
 */
global.get_price_format = function (price, type) {
  let pr = JSON.parse(price);

  if (1 == type) {
    if (think.isNumber(pr.present_price)) {
      pr.present_price = pr.present_price.toString();
    }
    let prices = pr.present_price.split("-");
    let present_price;
    if (prices.length > 1) {
      present_price = formatCurrency(prices[0]) + "-" + formatCurrency(prices[1]);
    } else {
      present_price = formatCurrency(prices[0])
    }
    price = present_price;
  } else {

    if (pr.discount_price == 0) {
      price = "";
    } else {
      price = formatCurrency(pr.discount_price);
    }

  }
  return price;
}

global.has_price = function (price) {
  let pr = JSON.parse(price);
  if (pr.present_price == 0 && pr.discount_price == 0) {
    return false;
  }
  return true;
}

/**
 * 将数值四舍五入(保留2位小数)后格式化成金额形式
 *
 * @param num 数值(Number或者String)
 * @return 金额格式的字符串,如'1,234,567.45'
 * @type String
 */
global.formatCurrency = function(num) {
  return accounting.formatMoney(num, '')
}

/**
 * global get_children
 * 获取子集分类 （这里是获取所有子集）
 */
global.get_children = function (nodes, parent, sn = 0) {
  // console.log(11);
  var children = [];
  var last = [];
  /* 未访问的节点 */
  /*
   * 获取根分类列表。
   * 创建一个虚拟父级分类亦可
   **/
  var node = null;
  for (var i in nodes) {
    node = nodes[i];
    if (node["pid"] == parent) {
      node["deep"] = 0;
      children.push(node);
    } else {
      last.push(node);
    }
  }
  if (sn == 0) {
    children.sort(sort_node);
  } else {
    children.sort(sort_node1);
  }


  /* 同级排序 */
  var jumper = 0;
  var stack = children.slice(0);
  /* easy clone */

  while (stack.length > 0
  /* just in case */ && jumper++ < 1000) {
    var shift_node = stack.shift();
    var list = [];
    /* 当前子节点列表 */
    var last_static = last.slice(0);
    last = [];
    for (var i in last_static) {
      node = last_static[i];
      if (node["pid"] == shift_node["id"]) {
        node["deep"] = shift_node["deep"] + 1;
        list.push(node);
      } else {
        last.push(node);
      }
    }
    if (sn == 0) {
      list.sort(sort_node);
    } else {
      list.sort(sort_node1);
    }


    for (var i in list) {
      node = list[i];
      stack.push(node);
      children.push(node);
    }
  }
  /*
   * 有序树非递归前序遍历
   *
   * */
  var stack = [];
  /* 前序操作栈 - 分类编号 */
  var top = null;
  /* 操作栈顶 */
  var tree = children.slice(0);
  /* 未在前序操作栈内弹出的节点 */
  var has_child = false;
  /* 是否有子节点，如无子节点则弹出栈顶 */
  var children = [];
  /* 清空结果集 */
  var jumper = 0;
  last = [];
  /* 未遍历的节点 */
  var current = null;
  /* 当前节点 */
  stack.push(parent);
  /* 建立根节点 */

  while (stack.length > 0) {
    if (jumper++ > 1000) {
      break;
    }
    top = stack[stack.length - 1];
    has_child = false;
    last = [];

    for (var i in tree) {
      current = tree[i];
      if (current["pid"] == top) {
        top = current["id"];
        stack.push(top);
        children.push(current);
        has_child = true;
      } else {
        last.push(current);
      }
    }
    tree = last.slice(0);
    if (!has_child) {
      stack.pop();
      top = stack[stack.length - 1];
    }
  }
  return children;
}

global.image_view = (str, w, m) => {
  //console.log(info);
  let imgReg = /<img.*?(?:>|\/>)/gi;
  let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
  let arr = str.match(imgReg);
  if (!think.isEmpty(arr)) {
    let narr = [];
    for (let img of arr) {
      let _img = img.match(srcReg)
      //console.log(_img);
      let nimg = _img[1] + '?imageView2/' + m + '/w/' + w;
      //console.log(nimg)
      let inputimg = _img['input'].replace(_img[1], nimg)
      narr.push(inputimg);
    }
    return str_replace(arr, narr, str);
  } else {
    return str;
  }
}

/**
 * 获取商品suk suk, arr:类型数组
 */
global.getsuk = function (suk, arr) {
  //console.log(suk);
  var suk_;
  suk.forEach(function (v, k) {

    if (v.name == arr[0]) {
      if (v.ch) {
        v.ch.forEach(function (v_, k_) {
          if (v_.name == arr[1]) {
            if (v_.ch) {
              v_.ch.forEach(function (v__, k__) {
                if (v__.name == arr[2]) {

                  suk_ = think.extend(v__, v_, v);
                }
              })
            } else {
              suk_ = think.extend(v_, v);
            }

          }
        })
      } else {
        suk_ = v;
      }
    }
  })
  return suk_;
}

/**
 * 排序函数
 */
function sort_node(v, w) {
  return v["sort"] - w["sort"];
}
function sort_node1(v, w) {
  return w["sort"] - v["sort"];
}

/**
 * 分析枚举类型配置值 格式 a:名称1,b:名称2
 * @param str
 * @returns {*}
 */
/* global parse_config_attr */
global.parse_config_attr = function(str) {
    let strs;
    if (str.search(/\r\n/ig) > -1) {
        strs = str.split("\r\n");
    } else if (str.search(/,/ig) > -1) {
        strs = str.split(",");
    } else if(str.search(/\n/ig) > -1){
        strs = str.split("\n");
    }else {
        strs = [str];
    }
    if (think.isArray(strs)) {
        let obj = {}
        strs.forEach(n => {
            n = n.split(":");
            obj[n[0]] = n[1];
        })
        return obj;
    }

}
global.parse_type_attr = function (str) {
    let strs;
    if (str.search(/\r\n/ig) > -1) {
        strs = str.split("\r\n");
    } else if (str.search(/,/ig) > -1) {
        strs = str.split(",");
    } else if(str.search(/\n/ig) > -1){
        strs = str.split("\n");
    }else {
        strs = [str];
    }
    if(think.isArray(strs)){
            let arr = [];
            for (let v of strs){
                let obj = {};
                v = v.split(":");
                if(!think.isEmpty(v[0])&&!think.isEmpty(v[1])){
                obj.id = v[0];
                obj.name = v[1];
                if(obj.id.split(".").length ==1){
                    obj.pid = 0
                }else {
                    obj.pid = obj.id.split(".").splice(0,obj.id.split(".").length-1).join(".");
                }
                arr.push(obj);
                }
            }
        //console.log(arr);
        let tree = arr_to_tree(arr,0)
       //think.log(tree);
        return tree;
    }

}

/* 解析列表定义规则*/
/* global get_list_field */
global.get_list_field = function(data, grid, controller, module) {
    module = module || "admin";
    //console.log(module);
    let data2 = {};
    let value;

    // 获取当前字段数据
    //console.log(grid);
    for (let field of grid.field) {
        let temp;
        let array = field.split('|');//TODO
        //console.log(array);
        temp = data[array[0]];
        //console.log(temp);
        // 函数支持
        if (!think.isEmpty(array[1])) {
            temp = call_user_func(array[1], temp);
        }
        data2[array[0]] = temp;
    }
    //console.log(data2);
    if (!think.isEmpty(grid.format)) {
        // value  =   preg_replace_callback('/\[([a-z_]+)\]/', function($match) use($data2){return $data2[$match[1]];}, $grid['format']);
    } else {
        value = data2[Object.keys(data2)];
    }

    // 链接支持
    if ('title' == grid.field[0] && '目录' == data.type) {
        // 目录类型自动设置子文档列表链接
        grid.href = '[LIST]';
    } else if ('title' == grid.field[0]) {
        grid.href = '[EDIT]';
    }

    if (!think.isEmpty(grid.href)) {

        let links = grid.href.split(',');

        let val = []
        for (let link of links) {
            let array = link.split('|');
            let href = array[0];

            //console.log(href);
            let matches = href.match(/^\[([a-z_]+)\]$/);
            if (matches) {
                val.push(data2[matches[1]])
                // console.log(val);
            } else {
                let show = !think.isEmpty(array[1]) ? array[1] : value;
                // console.log(show)
                // 替换系统特殊字符串
                let hrefs = {
                    '[DELETE]': 'setstatus/?status=-1&ids=[id]',
                    '[EDIT]': 'edit/?id=[id]&model=[model_id]&cate_id=[category_id]',
                    '[LIST]': 'index/?pid=[id]&model=[model_id]&cate_id=[category_id]'
                }
                let match = hrefs[href].match(/\[(\S+?)\]/g);
                // console.log(match);
                let u = [];
                for (let k of match) {
                    let key = k.replace(/(^\[)|(\]$)/g, "");
                    u.push(data[key]);
                }
                // console.log(u);
                let query = str_replace(match, u, hrefs[href]);
                let href1 = `/${controller}/${query}`;
                //console.log(query);
                if (href == "[DELETE]") {
                    val.push('<a href="' + href1 + '" class="text-info ajax-get confirm">' + show + '</a> ');
                } else {
                    val.push('<a href="' + href1 + '" class="text-info">' + show + '</a> ');
                }
            }
        }
        value = val.join(" ");
    }
    console.log('=========value', value)
    //console.log(value)
    return value;
}

/**
 * 获取多图封面
 * @param array arr_id
 * @param string field
 * @return 完整的数据或者 指定的field字段值
 * @author arterli <arterli@qq.com>
 */
/*global get_pics_one */
global.get_pics_one = async (arr_id, field) => {
    if (think.isEmpty(arr_id)) {
        return false;
    }
    var arr = arr_id.split(",");
    return get_cover(arr[0], field);

}

/**
 * 获取分类信息url
 * @param id
 * @param val
 * @param arr
 */
global.sort_url = (id,val,arr,http)=>{
    //console.log(http.get(val))
    let url;
        url=`${val}_${id}`;
        for(let v of arr){
            if(v.option.identifier != val){
                url += `|${v.option.identifier}_${http[v.option.identifier]||0}`
            }
        }
    //console.log(url);
    return url;
}

//{present_price:100,discount_price:80}
global.formatprice = function(price) {
    let pr = JSON.parse(price);
    var present_price;
    //console.log(pr);
    if (think.isNumber(pr.present_price)) {
        pr.present_price = pr.present_price.toString();
    }
    var price = pr.present_price.split("-");
    if (price.length > 1) {
        present_price = formatCurrency(price[0]) + "-" + formatCurrency(price[1]);
    } else {
        present_price = formatCurrency(price[0])
    }
    if (pr.discount_price == 0) {
        return `<span class="text-xs"><span class="text-danger">现价:￥${present_price}</span></span>`;
    } else {
        return `<span class="text-xs"><span class="text-danger">现价:￥${present_price}</span> <br>原价:￥${formatCurrency(pr.discount_price)}</span>`;
    }

}

//获取价格不格式化
global.get_price = function(price, type) {
    if (price) {
        price = JSON.parse(price);
        if (1 == type) {
            return price.present_price;
        } else {
            if (price.discount_price == 0) {
                return "";
            } else {
                return price.discount_price;
            }

        }
    }
}

/**
 * 将数值四舍五入(保留1位小数)后格式化成金额形式
 *
 * @param num 数值(Number或者String)
 * @return 金额格式的字符串,如'1,234,567.4'
 * @type String
 */
/*global formatCurrencyTenThou */
global.formatCurrencyTenThou = function(num) {
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num))
        num = "0";
    let sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 10 + 0.50000000001);
    let cents = num % 10;
    num = Math.floor(num / 10).toString();
    for (let i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' +
            num.substring(num.length - (4 * i + 3));
    return (((sign) ? '' : '-') + num + '.' + cents);
}

/**
 * 获取模型字段信息 
 * @param model_id 模型id 或 模型名称
 * @param id 数据id
 * @param field 字段
 * @param return 整条数据或字段数据
 * @author arterli <arterli@qq.com>
 */
/* global getmodelfield */
global.getmodelfield = async(model_id,id,field)=>{
     let res;
     let table = await think.model('model',think.config('model')).get_table_name(model_id);
     let modelinfo = await think.model(table,think.config('model')).find(id);
     if(!think.isEmpty(field)){
         res = modelinfo[field]
     }else{
         res = modelinfo;
     }
     return res;
}
/**
 * 获取模型字段
 * @param model_id
 * @param field
 * @returns {*}
 */
global.get_model= async(model_id,field)=>{
    return await think.model('model',think.config('model')).get_model(model_id,field);

}

/**
 * 时间戳格式化 dateformat()
 * @param extra 'Y-m-d H:i:s'
 * @param date  时间戳
 * @return  '2015-12-17 15:39:44'
 */
/* global dateformat */
global.dateformat = function(extra, date) {
    let D = new Date(date);
    let time = {
        "Y": D.getFullYear(),
        'm': D.getMonth() + 1,
        'd': D.getDate(),
        'H': D.getHours(),
        'i': D.getMinutes(),
        's': D.getSeconds()
    }
    let key = extra.split(/\W/);
    let _date;
    for (let k of key) {
        time[k] = time[k] < 10 ? "0" + time[k] : time[k]
        _date = extra.replace(k, time[k])
        extra = _date;
    }
    return _date;
}

//更新缓存
global.update_cache =(type)=>{
    switch (type){
        case 'category':
            //更新栏目缓存
            think.cache("sys_category_list",null);
            think.cache("all_category",null);
            think.cache("all_priv",null);//栏目权限缓存
            break;
        case 'channel'://更新频道缓存信息
            think.cache("get_channel_cache",null);
            break;
        case 'model':
            think.cache("get_document_model", null);//清除模型缓存
            think.cache("get_model", null);//清除模型缓存
            break;
    }
}

/**
 *缓存权限列表 all_priv
 * @param catid 要验证的栏目id
 * @param roleid 用户组
 * @param action 权限类型
 * @param is_admin 谁否前台 0前台，1后台
 * @param type true
 * @returns {bool} 返回flase 或true false:没权限，true:有权限。
 */
global.priv = async(catid, roleid, action, is_admin = 0, type = true) => {
  const priv = await think.model('category_priv').priv(catid, roleid, action, is_admin, type);
  // console.log(priv);
  if (!priv) {
    return false;
  } else {
    return true;
  }
};
