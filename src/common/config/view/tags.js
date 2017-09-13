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
class Channel extends BaseTag {
  constructor () {
    super()
    this.tags = ['channel']
  }

  async run (context, args, cb) {
    let field = _.defaultTo(args.data, 'data')
    let channels = await think.model('channel').getCachedChannels()
    context.ctx[field] = channels
    return cb(null, '')
  }
}

class Topic extends BaseTag {
  constructor () {
    super()
    this.tags = ['topic']
  }

  async run (context, args, cb) {
    let where = { status: 1, pid: 0 }
    let field = _.defaultTo(args.data, 'data')
    let limit = _.defaultTo(args.limit, '10')
  }
}
topic = function(){

    this.run = async function (context, args, callback) {
       // console.log(args);
        let where = {'status':1,'pid':0};
        let dataName = think.isEmpty(args.data) ? "data" : args.data;
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
        let model = think.model('document');
        let cache = think.isEmpty(args.cache) ? false : Number(args.cache)*1000;
        //缓存
        if(cache){
            model.cache(cache);
        }
        if(args.tid &&!think.isEmpty(args.tval)){
            //console.log();
            for(let v in JSON.parse(args.tval)){
                where["t."+v]=JSON.parse(args.tval)[v]
            }
            //console.log(where);
           model.join({
                table: "type_optionvalue"+args.tid,
                join: "left", // 有 left,right,inner 3 个值
                as: "t",
                on: ["id", "tid"]

            });
        }

            let topic = await model.where(where).limit(limit).order(type).select();

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


export default env => {
  env.addExtension('channel', new Channel())
}
