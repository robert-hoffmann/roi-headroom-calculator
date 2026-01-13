import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'

// Import Tailwind CSS (includes all styles)
import './assets/styles/tailwind.css'

// Create app
const app = createApp(App)

// Use Pinia for state management with persistence
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// Mount app
app.mount('#app')
