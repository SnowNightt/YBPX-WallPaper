const routes = [
  {
    path: '/:any(.*)*',
    name: 'home',
    component: () => import('@renderer/views/Home.vue')
  },
  {
    path: '/setting',
    name: 'setting',
    component: () => import('@renderer/views/Setting.vue')
  },
  {
    path: '/selectpage',
    name: 'selectpage',
    component: () => import('@renderer/views/SecletPage.vue')
  },
  {
    path: '/like',
    name: 'like',
    component: () => import('@renderer/views/Like.vue')
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('@renderer/views/User.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@renderer/views/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@renderer/views/Register.vue')
  },
  {
    path: '/sort',
    name: 'sort',
    component: () => import('@renderer/views/Sort.vue')
  },
  {
    path: '/ai',
    name: 'ai',
    component: () => import('@renderer/views/AiChat.vue')
  },
]
export default routes
