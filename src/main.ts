import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'
import axios from 'axios'

import { baseURL } from './config'

axios.defaults.withCredentials = false
axios.defaults.baseURL = baseURL
//axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

const app = createApp(App).use(router).use(ContextMenu)
app.config.globalProperties.serverAddr = baseURL
app.mount('#app')
