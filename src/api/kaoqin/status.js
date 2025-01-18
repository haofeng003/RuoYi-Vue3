import request from '@/utils/request'

// 查询班级数据图列表
export function listStatus(query) {
  return request({
    url: '/kaoqin/status/list',
    method: 'get',
    params: query
  })
}

// 查询班级数据图详细
export function getStatus(id) {
  return request({
    url: '/kaoqin/status/' + id,
    method: 'get'
  })
}

// 新增班级数据图
export function addStatus(data) {
  return request({
    url: '/kaoqin/status',
    method: 'post',
    data: data
  })
}

// 修改班级数据图
export function updateStatus(data) {
  return request({
    url: '/kaoqin/status',
    method: 'put',
    data: data
  })
}

// 删除班级数据图
export function delStatus(id) {
  return request({
    url: '/kaoqin/status/' + id,
    method: 'delete'
  })
}
