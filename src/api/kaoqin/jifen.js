import request from '@/utils/request'

// 查询记分规则列表
export function listJifen(query) {
  return request({
    url: '/kaoqin/jifen/list',
    method: 'get',
    params: query
  })
}

// 查询记分规则详细
export function getJifen(id) {
  return request({
    url: '/kaoqin/jifen/' + id,
    method: 'get'
  })
}

// 新增记分规则
export function addJifen(data) {
  return request({
    url: '/kaoqin/jifen',
    method: 'post',
    data: data
  })
}

// 修改记分规则
export function updateJifen(data) {
  return request({
    url: '/kaoqin/jifen',
    method: 'put',
    data: data
  })
}

// 删除记分规则
export function delJifen(id) {
  return request({
    url: '/kaoqin/jifen/' + id,
    method: 'delete'
  })
}
