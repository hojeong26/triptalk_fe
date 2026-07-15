import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons'
import { faEye } from '@fortawesome/free-solid-svg-icons'

library.add(farHeart, faEye)

const app = createApp(App)
app.component('FontAwesomeIcon', FontAwesomeIcon)
app.use(router)
app.use(createPinia())
app.mount('#app')
