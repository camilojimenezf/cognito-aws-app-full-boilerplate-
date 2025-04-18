import { createApp } from 'vue'
import { Amplify } from 'aws-amplify'
import { createPinia } from 'pinia'

import './assets/main.css'
import App from './App.vue'

import { amplifyConfig } from './config/providers/amplify-config'
import { router } from './router'

Amplify.configure(amplifyConfig)

const app = createApp(App)

app.use(router)
app.use(createPinia())

app.mount('#app')
