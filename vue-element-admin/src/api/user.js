import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/user/Authenticate/authenticate',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    
    url: '/api/user/getInfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
