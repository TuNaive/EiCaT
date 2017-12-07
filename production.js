const Application = require('thinkjs')
const babel = require('think-babel')
const notifier = require('node-notifier')

const instance = new Application({
  ROOT_PATH: __dirname,
  proxy: true, // use proxy
  transpiler: [babel, {
    presets: ['think-node']
  }],
  notifier: notifier.notify.bind(notifier),
  env: 'production'
})

instance.run()
