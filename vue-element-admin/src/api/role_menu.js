import request from '@/utils/request'

export function  RoleMenuListByCode(data) {
    return request({
      url: `/api/role/RoleMenuListByCode`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data
    })
}
