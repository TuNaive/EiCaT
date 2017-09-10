import _ from 'lodash'

class Channel {
  constructor () {
    this.tags = ['channel']
  }

  // get tags() {
  //   return ['channel']
  // }

  parser (parser, nodes, lexer) {
    let token = parser.nextToken
    let args =  parser.parseSignature(null, true)
    parser.advanceAfterBlockEnd(token.value)
    return new nodes.CallExtensionAsync(this, 'run', args)
  }

  async run (context, args, cb) {
    const field = _.defaultTo(args.data, 'data')
    const channels = await think.model('channels').getCacheChannels()
    context.ctx[field] = channels
    return cb(null, '')
  }
}

export default {
  Channel: function () {
    this.tags = ['channel']
    this.parser = function (parser, nodes, lexer) {
      let token = parser.nextToken
      let args =  parser.parseSignature(null, true)
      parser.advanceAfterBlockEnd(token.value)
      return new nodes.CallExtensionAsync(this, 'run', args)
    }
    this.run = async function (context, args, cb) {
      const field = _.defaultTo(args.data, 'data')
      const channels = await think.model('channels').getCacheChannels()
      context.ctx[field] = channels
      return cb(null, '')
    }
  }
}
