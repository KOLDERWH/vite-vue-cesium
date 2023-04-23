import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

const app = createApp(App)
//pinia bus
app.use(createPinia())
//elementui
app.use(ElementPlus)
app.mount('#app')
