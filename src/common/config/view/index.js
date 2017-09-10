import path from 'path'
import nunjucks from 'think-view-nunjucks'
import Tags from './tags'

export default {
  type: 'nunjucks',
  common: {
    viewPath: path.join(think.ROOT_PATH, 'view'),
    sep: '_',
    extname: '.html'
  },
  nunjucks: {
    handle: nunjucks,
    beforeRender: (env, nunjucks, config) => {
      // env.addExtension('keywords', new keywords())
      // env.addExtension('tagtest', new mytags())
      // env.addExtension('column', new column())
      env.addExtension('channel', new channel())
      // env.addExtension('topic', new topic())
      // env.addExtension('groups', new groups())
      // env.addExtension('keywords', new keywords())
      // env.addExtension('rkeywords', new rkeywords())
      // env.addExtension('model',new model())
      env.addFilter('show_ad', async (spaceid,type,callback) => {
        callback(null, {})
      }, true)
      env.addFilter('formatCurrency', num => {
        return 'aaa'
      })
    }
  }
}