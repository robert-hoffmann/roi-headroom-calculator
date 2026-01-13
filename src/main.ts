import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Import styles
import './assets/styles/main.css'

// Create app
const app = createApp(App)

// Use Pinia for state management
app.use(createPinia())

// Mount app
app.mount('#app')
