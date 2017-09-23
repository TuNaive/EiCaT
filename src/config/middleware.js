// deps
import path from 'path'

// variables
const isDev = think.env === 'development'

export default [
  {
    handle: 'meta',
    options: {
      logRequest: isDev,
      sendResponseTime: isDev
    }
  },
  {
    handle: 'resource',
    enable: isDev,
    options: {
      root: path.join(think.ROOT_PATH, 'www'),
      publicPath: /^\/(static|upload|favicon\.ico)/
    }
  },
  {
    handle: 'trace',
    enable: !think.isCli,
    options: {
      debug: isDev,
      templates: {
        404: path.join(think.ROOT_PATH, 'view/common/error_404.html'),
        500: path.join(think.ROOT_PATH, 'view/common/error_500.html')
      }
    }
  },
  {
    handle: 'payload',
    options: {}
  },
  {
    handle: 'router',
    options: {
      optimizeHomepageRouter: false
    }
  },
  'logic',
  'controller'
]
