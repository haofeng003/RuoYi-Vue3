import request from '@/utils/request'

// 查询其他扣分列表
export function listWeiji(query) {
  return request({
    url: '/kaoqin/weiji/list',
    method: 'get',
    params: query
  })
}

// 查询其他扣分详细
export function getWeiji(id) {
  return request({
    url: '/kaoqin/weiji/' + id,
    method: 'get'
  })
}

// 新增其他扣分
export function addWeiji(data) {
  return request({
    url: '/kaoqin/weiji',
    method: 'post',
    data: data
  })
}

// 修改其他扣分
export function updateWeiji(data) {
  return request({
    url: '/kaoqin/weiji',
    method: 'put',
    data: data
  })
}

// 删除其他扣分
export function delWeiji(id) {
  return request({
    url: '/kaoqin/weiji/' + id,
    method: 'delete'
  })
}
