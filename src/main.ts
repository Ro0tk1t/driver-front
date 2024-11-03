import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import axios from 'axios'
axios.defaults.withCredentials = false
axios.defaults.baseURL = 'http://192.168.206.128:8000'
//axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

const app = createApp(App).use(router)
app.config.globalProperties.serverAddr = 'http://192.168.206.128:8000'
app.mount('#app')
