import path from 'path'
import view from 'think-view'
import model from 'think-model'
import fetch from 'think-fetch'
import email from 'think-email'
import cache from 'think-cache'
import session from 'think-session'
import createI18n from 'think-i18n'

const localRegs = {
  cn: /^cn.*$/,
  en: /^en.*$/
}
const i18n = createI18n({
  app: think.app,
  i18nFolder: path.resolve(__dirname, './locales'),
  defaultLocale: 'zh-cn',
  getLocale: { by: 'cookie', name: 'locale' },
  localesMapping: locales => {
    for (local of locales) {
      if (localRegs.cn.test(local)) {
        return 'zh-cn'
      } else if (localRegs.en.test(local)) {
        return 'en-us'
      }
    }
    return 'zh-cn'
  }
})

export default [
  view,
  model(think.app),
  fetch,
  email,
  cache,
  session,
  i18n
]
