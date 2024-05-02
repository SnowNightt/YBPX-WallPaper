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
  }
]
export default routes
