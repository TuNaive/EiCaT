import path from 'path'
import nunjucks from 'think-view-nunjucks'
import enrichTag from './tags'
import enrichFilter from './filters'

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
      // custom tags
      enrichTag(env)
      // custom filters
      enrichFilter(env)
    }
  }
}