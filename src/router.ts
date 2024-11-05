import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs'
import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('./components/index.vue')
  },
  {
    path: '/help',
    name: 'help',
    component: () => import('./components/help.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('./components/login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('./components/register.vue')
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('./components/user.vue')
  },
  {
    path: '/files',
    name: 'files',
    component: () => import('./components/files.vue')
  },
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: '404',
  //   component: () => import('./components/404.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router