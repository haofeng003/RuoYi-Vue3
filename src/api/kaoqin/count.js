import request from '@/utils/request'

// 查询班级违纪人数列表
export function listCount(query) {
  return request({
    url: '/kaoqin/count/list',
    method: 'get',
    params: query
  })
}

// 查询班级违纪人数详细
export function getCount(clazzName) {
  return request({
    url: '/kaoqin/count/' + clazzName,
    method: 'get'
  })
}

// 新增班级违纪人数
export function addCount(data) {
  return request({
    url: '/kaoqin/count',
    method: 'post',
    data: data
  })
}

// 修改班级违纪人数
export function updateCount(data) {
  return request({
    url: '/kaoqin/count',
    method: 'put',
    data: data
  })
}

// 删除班级违纪人数
export function delCount(clazzName) {
  return request({
    url: '/kaoqin/count/' + clazzName,
    method: 'delete'
  })
}
