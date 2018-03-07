// invoked in worker
require('./global')
require('./model')

think.beforeStartServer(async () => {
  const settings = await think.model('setting').initSettings()
  think.config('settings', settings)
})