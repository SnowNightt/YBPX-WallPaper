import '@renderer/assets/tailwind.css'
import '@renderer/assets/global.scss'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//引入图片懒加载插件
import Lazyload from "vue3-lazyload";
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import './permission'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)
app.use(Lazyload, {
  error: 'http://localhost:3000/api/error', // http://localhost:3000/api/error
  loading: 'http://localhost:3000/api/loading' // http://localhost:3000/api/loading
})
app.use(router)
app.use(pinia)
app.use(ElementPlus)
app.mount('#app')
