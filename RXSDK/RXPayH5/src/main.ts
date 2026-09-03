import 'amfe-flexible'
import './styles/global.scss'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { Notify, Loading } from 'vant'
import 'vant/lib/index.css'
// import eruda from 'eruda'
// eruda.init()

const version = '1.0.1'
const cacheNeedsCleared = true

if (cacheNeedsCleared) {
  const currentVersion = localStorage.getItem('version')

  // 如果缓存中存在版本号，需要查看更新
  if (currentVersion) {
    // 如果版本号不一致，则有更新需要清空缓存
    if (currentVersion !== version) {
      localStorage.clear()
      localStorage.setItem('version', version)
    }
  } else {
    localStorage.setItem('version', version)
  }
}

// vue instance
const app = createApp(App)
app.use(router)
app.use(Notify)
app.use(Loading)
app.mount('#app')

export default app