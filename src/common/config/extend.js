import view from 'think-view'
import model from 'think-model'
import fetch from 'think-fetch'
import email from 'think-email'
import cache from 'think-cache'
import session from 'think-session'

export default [
  view,
  model(think.app),
  fetch,
  email,
  cache,
  session
]
