import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router'
import { createPinia } from 'pinia'
import '../style.css';
import App from './App.vue';
import Index from '@/views/Index.vue'
import Settings from '@/views/Settings.vue'
import Summary from '@/views/Summary.vue'
import Search from '@/views/Search.vue';
import ReadLater from '@/views/ReadLater.vue';
import Alarm from '@/views/Alarm.vue';

const routes = [
    {
      path: '/',
      component: Index
    },
    {
      path: '/settings',
      component: Settings
    },
    {
      path: '/summary',
      component: Summary
    },
    {
      path: '/search',
      component: Search
    },
    {
      path: '/readlater',
      component: ReadLater
    },
    {
      path: '/alarm',
      component: Alarm
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)
app.mount('#app')