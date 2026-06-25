import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import WriteView from '@/views/WriteView.vue'
import HistoryView from '@/views/HistoryView.vue'
import DashboardView from '@/views/DashboardView.vue'
import TemplatesView from '@/views/TemplatesView.vue'
import SettingsView from '@/views/SettingsView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/write', name: 'write', component: WriteView },
    { path: '/history', name: 'history', component: HistoryView },
    { path: '/dashboard', name: 'dashboard', component: DashboardView },
    { path: '/templates', name: 'templates', component: TemplatesView },
    { path: '/settings', name: 'settings', component: SettingsView }
  ]
})

export default router
