import { createApp } from 'vue'
import './styles/globals.scss'
import './styles/transition.scss'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
