import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/ai-assistant',
      name: 'aiAssistant',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/shipping-notice',
      name: 'shippingNotice',
      component: () => import('../views/ShippingNoticeView.vue'),
    },
    {
      path: '/slacking-master',
      name: 'slackingMaster',
      component: () => import('../views/SlackingMasterView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
    },
  ],
})

export default router
