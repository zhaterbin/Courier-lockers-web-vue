import { constantRoutes } from '@/router'
import { RoleMenuListByCode } from '@/api/role_menu'
import Layout from '@/layout/index'

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRoutes(asyncRouterMap) {
  return asyncRouterMap.filter(route => {
    if (route.component) {
      // Layout组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRoutes(route.children)
    }
    return true
  })
}
function loadView(view) {
  // 注意：webpack4动态import不支持变量方式，如下写法是不行的
  // return () => import(`@/views/${view}`)
  return resolve => require([`@/views/${view}`], resolve)
}

const permission = {
  state: {
    routes: [],
    addRoutes: [],
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    },
  },
  actions: {
    GenerateRoutes({ commit }) {
      const Id = sessionStorage.getItem('SESSION_KEY')
      return new Promise(resolve => {
        RoleMenuListByCode(Id).then(res => {
          const accessedRoutes = filterAsyncRoutes(res.data)
          accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
        })
      })
    },
  },
}
