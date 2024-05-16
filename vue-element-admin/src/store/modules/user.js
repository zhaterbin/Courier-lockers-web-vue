import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  // menus: "",//新增
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  //  // 新增
  //  SET_MENUS: (state, menus) => {
  //   state.menus = menus
  // }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        
        const { data } = response
        
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    
    console.log(state);
    return new Promise((resolve, reject) => {
      // debugger
      // getInfo(state.token).then(response => {
        // const { data } = response

        // if (!data) {
        //   reject('Verification failed, please Login again.')
        // }

        // const data= { roles : ['editor'], name:'Administrator', avatar : 'https://th.bing.com/th?id=OIP.KwINwKYn-DMCBTqfBpyTkwHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2', introduction : '123' } ;
        // const {roles,name,avatar,introduction}=data
        // roles must be a non-empty array
        // if (!roles || roles.length <= 0) {
        //   reject('getInfo: roles must be a non-null array!')
        // }
        // debugger
        
        getInfo(state.token).then(response => {
          
          const { data } = response
          
          if (!data) {
            reject('Verification failed, please Login again.')
          }
          
          const { roles, name, avatar, introduction } = data
        //   const menus = [
        //     {
        //       "path": "/system",
        //       "redirect": "/menu",
        //       "component": "Layout",
        //       "meta": {
        //         "title": "系统管理",
        //         "icon": "form"
        //       },
        //       "children": [{
        //         "path": "/menu",
        //         "name": "menu",
        //         "component": "menu/index",
        //         "meta": {
        //           "title": "菜单管理",
        //           "icon": "table",
        //         }
        //       },
        //       {
        //         "path": "/roles",
        //         "name": "roles",
        //         "component": "roles/index",
        //         "meta": {
        //           "title": "角色管理",
        //           "icon": "table",
        //         }
        //       },
        //       {
        //         "path": "/administrator",
        //         "name": "administrator",
        //         "component": "dashboard/index",
        //         "meta": {
        //           "title": "用户管理",
        //           "icon": "table"
        //         }
        //       }
        //       ]
        //     }
  
        //   ]
        //   //如果需要404 页面，请在此处添加
        // menus.push({
        //   path: "/404",
        //   component: "404",
        //   hidden: true
        // }, {
        //   path: "*",
        //   redirect: "/404",
        //   hidden: true
        // })

          if (!roles || roles.length <= 0) {
            reject('getInfo: roles must be a non-null array!')
          }
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        // commit("SET_MENUS", menus) // 触发vuex SET_MENUS 保存路由表到vuex
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        // commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
