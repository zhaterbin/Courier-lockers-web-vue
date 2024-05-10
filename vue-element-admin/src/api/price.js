import request from '@/utils/request'


export function  fetchReportList(data) {
        return request({
          url: `/api/InStorage/PriceRulerPage`,
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          data
        })
    }

export function  InPriceRuler(data) {
      return request({
        url: `/api/InStorage/InPriceRuler`,
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        data
      })
  }

  export function  DeleteRuler(data) {
    return request({
      url: `/api/InStorage/DeleteRuler`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data
    })
}

export function  UpdateRuler(data) {
  return request({
    url: `/api/InStorage/UpdateRuler`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}
