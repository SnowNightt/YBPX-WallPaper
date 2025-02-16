import router from './router/index.js'
// 引入ts类型
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
// 引入获取token的方法
import { getToken } from './utils/token.js'

router.beforeEach(
  async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    let token = getToken()
    // 已登录
    if (token) {
      // 已登录且去login
      if (to.path == '/login') {
        // 原地tp
        next(from.path)
      } else {
        // 已登录且去其他路由
        next()
      }
    }
    // 未登录
    else {
      // 未登录且去login
      if (to.path == '/login'|| to.path=='/register') {
        next()
      } else {
        // 未登录且去其他路由
        next({
          path: '/login'
        })
      }
    }
    next()
  }
)
