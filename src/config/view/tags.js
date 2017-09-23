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

// 自定义标签Banner
// 用于获取网站配置的广告横幅
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

export default env => {
  env.addExtension('channel', new Channel())
  env.addExtension('banner', new Banner())
}
