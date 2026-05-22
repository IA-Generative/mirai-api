// https://vitepress.dev/guide/custom-theme
import type { EnhanceAppContext } from 'vitepress'

import TwoSlashFloatingVue from '@shikijs/vitepress-twoslash/client'
import Theme from 'vitepress/theme'
import { h } from 'vue'

import './style.css'
import '@shikijs/vitepress-twoslash/style.css'

export default {
  ...Theme,
  outlineTitle: 'Sur cette page',
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(TwoSlashFloatingVue as any)
  },
}
