class BaseTag {
  constructor () {
  }

  parse (parser, nodes, lexer) {
    let token = parser.nextToken()
    let args =  parser.parseSignature(null, true)
    parser.advanceAfterBlockEnd(token.value)
    return new nodes.CallExtensionAsync(this, 'run', args)
  }
}

// 自定义标签channel
// 用于获取网站配置的频道
// 暂废弃
// class Channel extends BaseTag {
//   constructor () {
//     super()
//     this.tags = ['channel']
//   }

//   async run (context, args, cb) {
//     let field = _.defaultTo(args.data, 'data')
//     let channels = await think.model('channel').getCachedChannels()
//     context.ctx[field] = channels
//     return cb(null, '')
//   }
// }

/**
 * 获取同一级栏目标签
 *{%column data = "list"%}
 * @param data:接受返回数据的变量名称，例: data = "list"
 *  {% column data="list",pid=1 %}
 * @param pid: 获取同级栏目
 * {% column data="list",cid=1 %}
 * @param cid: 获取里栏目
 * {% column data="list",tree=1 %}
 * @param tree:获取栏目的树结构 tree="0",从pid为0开始获取
 * @param isapp: 是否在在移动端调用 iaapp="all" 调用全部栏目 isapp="1" pid为0的栏目,isindex="1",除去封面。
 * @parpm isnum = "1" ,1-获取栏目条数,默认不获取
 */
class Column extends BaseTag {

  constructor () {
    super()
    this.tags = ['column']
  }

  async run (context, args, callback) {
    let data = think.isEmpty(args.data) ? "data" : args.data;
    let pid = !think.isEmpty(args.pid) ? args.pid : false;
    let cid = !think.isEmpty(args.cid) ? args.cid : false;
    let tree = !think.isEmpty(args.tree) ? args.tree : false;
    let isapp = !think.isEmpty(args.isapp) ? args.isapp : false;
    let isindex = !think.isEmpty(args.isindex) ? args.isindex : false;

    let column = await think.model('category').get_all_category();
    if (args.isnum == 1) {
      for (let v of column) {
        v.doc_num = await think.model('document').where({category_id: v.id, status: [">", 0]}).count("id");
      }
    }
    //console.log(column);
    let arr;
    //获取同级栏目
    let map = {};
    if (pid) {
      map.pid = think._.toInteger(pid);
      arr = think._.filter(column, map)
    } else if (cid) {
      map.pid = think._.toInteger(cid);
      arr = think._.filter(column, map)
      // console.log(arr);
    } else if (tree) {
      let trees = arr_to_tree(column, tree);
      //console.log(trees)
      arr = !think.isEmpty(trees) ? trees : false;
    } else if (isapp || isapp == 0) {

      map.isapp = 1;
      if (think.isNumberString(isapp) || think.isNumber(isapp)) {
        map.pid = think._.toInteger(isapp);
      }
      arr = think._.filter(column, map);
      if (isindex) {
        for (let v of arr) {
          v.url = (v.url).replace(/channel/, 'column');
        }
      }
    }
    context.ctx[data] = arr;
    return callback(null, '');
  };

}

/**
 * 获取数据标签
 * {% topic data = "data"%}
 * topic:标签名称
 * data:接受返回数据的变量名称，例: data = "data"
 * limit: 设置查询结果的条数，例: limit="10",limit="3,10"
 * cid: 栏目id ,单个栏目 cid="1",多个栏目 cid = "1,2,3,4" , 不写调取全部栏目
 * {{name|get_url(id)}}文章链接
 * type: 标签类型,hot-安装浏览量从高到底,level-安装优先级从高到低排序,默认安装更新时间排序
 * //{% topic data = "data",limit= "5",cid=category.id,type="hot"%}
 * position:1:列表推荐,2:频道推荐,4:首页推荐
 * ispic:是否包涵缩略图,1:包含缩略图的内容,2:不包含缩略图,默认所有
 * issub:1:包含自栏目,2:不包含自栏目,默认包含自栏目
 * isstu:1:获取副表内容,2:只从主表拿数据,默认只从主表拿
 * group:分组id，单个分组：group="1",多个分组 :group="1,2,3,4",不写调取全部分组。
 * where:查询条件''
 * tid ;分类信息id
 * tval;分类信息条件
 */
class Topic extends BaseTag {
  constructor () {
    super()
    this.tags = ['topic']
  }

  async run (context, args, callback) {
    // console.log(args);
    let where = {'status':1,'pid':0};
    let data = think.isEmpty(args.data) ? "data" : args.data;
    let limit = think.isEmpty(args.limit) ? "10" : args.limit;
    //获取当前分类的所有子栏目
    if(args.issub!=2){
      if(!think.isEmpty(args.cid)){
        let cids = `${args.cid}`;
        let cidarr = []
        for (let v of cids.split(",")){
          let subcate = await think.model('category').get_sub_category(v);
          cidarr = cidarr.concat(subcate)
          cidarr.push(Number(v))
        }

        args.cid=unique(cidarr).sort();
      }
    }

    //subcate.push(cate.id);
    let cid = think.isEmpty(args.cid) ? false :{'category_id':['IN',args.cid]};
    if(cid){
      where = think.extend({},where,cid);
    }
    //分组
    if( !think.isEmpty(args.group)){
      where = think.extend(where,{'group_id':['IN',args.group]});
    }
    let type='create_time DESC';
    if(!think.isEmpty(args.type)){
      if(args.type=="hot"){
        type="view DESC"
      }else if(args.type == "level"){
        type="level DESC"
      }
    }
    //推荐
    if(!think.isEmpty(args.position)){
      where = think.extend(where,{position:args.position})
    }
    //是否缩略图
    if(!think.isEmpty(args.ispic)){
      if(args.ispic ==1){
        where = think.extend(where,{cover_id:['>',0]});
      }else if(args.ispic == 2){
        where = think.extend(where,{cover_id:0});
      }
    }

    //console.log(where);
    let topic
    if(args.tid &&!think.isEmpty(args.tval)){
      //console.log();
      for(let v in JSON.parse(args.tval)){
        where["t."+v]=JSON.parse(args.tval)[v]
      }
      //console.log(where);
      topic = await think.model('document').join({
        table: "type_optionvalue"+args.tid,
        join: "left", // 有 left,right,inner 3 个值
        as: "t",
        on: ["id", "tid"]

      }).where(where).limit(limit).order(type).select();
    }else {
      topic = await think.model('document').where(where).limit(limit).order(type).select();
    }
    //副表数据
    if(args.isstu == 1){
      let topicarr = [];
      let stuwhere ={};

      for(let v of topic){
        let table =await think.model("model").get_table_name(v.model_id);
        let details = await think.model(table).find(v.id);
        topicarr.push(think.extend({},v,details));
      }
      if(!think.isEmpty(args.stuwhere)){
        stuwhere = JSON.parse(args.stuwhere);
        topicarr =  think._.filter(topicarr, stuwhere)
      }
      topic = topicarr;
    }
    //console.log(topic)
    context.ctx[data] = topic;
    return callback(null, '');
  }
}

/*
* 自定义标签Banner
* 用于获取网站配置的广告横幅
* */
class Banner extends BaseTag {
  constructor () {
    super()
    this.tags = ['banner']
  }

  async run (context, args, cb) {
    let where = { status: 1 }
    let field = _.defaultTo(args.data, 'data')
    let limit = _.defaultTo(args.limit, '10')
    let banners = await think.model('banner').getCachedBanners(limit)

    context.ctx[field] = banners
    return cb(null, '')
  }
}

/**
 *获取分类分组标签
 *  {% groups data="groups",cid="1"%}
 */

class Groups extends BaseTag {
  constructor () {
    super()
    this.tags = ['groups']
  }

  async run (context, args, callback) {
    const data = think.isEmpty(args.data) ? 'data' : args.data;
    context.ctx[data] = await think.model('category').get_groups(args.cid);
    return callback(null, '');
  }
};

/**
 *获取话题标签
 * {% keywords data ="kws"%}
 *
 * data:接受返回数据的变量名称，例: data = "data"
 * limit: 设置查询结果的条数，例: limit="10",limit="3,10"
 * type: hot
 * cache {Number} 缓存有效时间，单位为秒,建议1000秒
 */

class Keywords extends BaseTag {
  constructor () {
    super()
    this.tags = ['keywords']
  }


  async run (context, args, callback) {
    const data = think.isEmpty(args.data) ? 'data' : args.data;
    const where = {};
    const limit = think.isEmpty(args.limit) ? '10' : args.limit;
    const mod = think.isEmpty(args.mod) ? '' : ',' + args.mod;
    let type = 'discuss_count_update DESC';
    if (!think.isEmpty(args.type)) {
      if (args.type == 'hot') {
        type = 'videonum DESC';
      }
    }
    const model = think.model('keyword');
    const cache = think.isEmpty(args.cache) ? false : Number(args.cache) * 1000;
    // 缓存
    if (cache) {
      model.cache(cache);
    }
    const keywrod = await model.where(where).limit(limit).order(type).select();
    // console.log(channel);
    for (const k of keywrod) {
      k.url = `/t/${k.keyname}${mod}`;
    }
    context.ctx[data] = keywrod;
    return callback(null, '');
  };
};

export default env => {
  // env.addExtension('channel', new Channel())
  env.addExtension('banner', new Banner())

  /**
   * 获取分类标签
   */
  env.addExtension('column', new Column(), true);

  /**
   * 获取数据标签
   */
  env.addExtension('topic', new Topic(), true);
  /**
   * 获取分类分组
   */
  env.addExtension('groups', new Groups(), true);
  /**
   * 获取话题
   */
  env.addExtension('keywords', new Keywords(), true);
}
