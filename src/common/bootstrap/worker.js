// invoked in worker
require('./custom/tags')

think.beforeStartServer(async () => {
  const settings = await think.model('setting').initSettings()
  think.config('settings', settings)
})