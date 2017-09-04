// deps
import fileCache from 'think-cache-file'
import nunjucks from 'think-view-nunjucks'
import fileSession from 'think-session-file'
import mysql from 'think-model-mysql'
import path from 'path'

// variables
const isDev = think.env === 'development'
const cachePath = path.join(think.ROOT_PATH, 'runtime/cache')

/**
 * cache adapter config
 * @type {Object}
 */
exports.cache = {
  type: 'file',
  common: {
    timeout: 24 * 60 * 60 * 1000 // millisecond
  },
  file: {
    handle: fileCache,
    cachePath: cachePath, // absoulte path is necessarily required
    pathDepth: 1,
    gcInterval: 24 * 60 * 60 * 1000 // gc interval
  }
}

/**
 * model adapter config
 * @type {Object}
 */
exports.model = {
  type: 'mysql',
  common: {
    logConnect: isDev,
    logSql: isDev,
    logger: msg => think.logger.info(msg)
  },
  mysql: {
    handle: mysql,
    database: 'ectaio',
    prefix: 'ect_',
    encoding: 'utf8',
    host: '127.0.0.1',
    port: 3306,
    connectionLimit: 10,
    user: 'ectuser',
    password: 'ect123',
    cache: { // 额外的缓存配置
      type: 'file',
      handle: fileCache,
      cachePath: cachePath,  // absoulte path is necessarily required
    }
    // dateStrings: true
  }
}

/**
 * session adapter config
 * @type {Object}
 */
exports.session = {
  type: 'file',
  common: {
    cookie: {
      name: 'ect_genius.id'
      // keys: ['werwer', 'werwer'],
      // signed: true
    }
  },
  file: {
    handle: fileSession,
    sessionPath: path.join(think.ROOT_PATH, 'runtime/session')
  }
}

/**
 * view adapter config
 * @type {Object}
 */
exports.view = {
  type: 'nunjucks',
  common: {
    viewPath: path.join(think.ROOT_PATH, 'view'),
    sep: '_',
    extname: '.html'
  },
  nunjucks: {
    handle: nunjucks
  }
}
