import { asyncRoutes, constantRoutes } from '@/router'
import {RoleMenuListByCode} from '@/api/role_menu'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
          //   var arr = []
    //   //进行异步数组过滤
    //   asyncRoutes.forEach((item)=>{
    //     if(item.hasOwnProperty('meta')){
    //       if(item.meta.hasOwnProperty('roles')){
    //         if (item.meta.roles.includes('admin')){
    //           arr.push(item)
    //         }
    //       }
    //     }
    //   })
    //   console.log(asyncRoutes)
    //   accessedRoutes = arr || []
    // }else{
    //   accessedRoutes = filterAsyncRoutes(asyncRoutes,roles)
    // }
    })
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}
