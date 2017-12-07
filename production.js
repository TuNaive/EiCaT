const Application = require('thinkjs')
const babel = require('think-babel')

const instance = new Application({
  ROOT_PATH: __dirname,
  proxy: true, // use proxy
  transpiler: [babel, {
    presets: ['think-node']
  }],
  env: 'production'
})

instance.run()
