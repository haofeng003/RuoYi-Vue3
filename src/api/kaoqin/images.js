import request from '@/utils/request'

// 查询每日图片列表
export function listImages(query) {
  return request({
    url: '/kaoqin/images/list',
    method: 'get',
    params: query
  })
}

// 查询每日图片详细
export function getImages(id) {
  return request({
    url: '/kaoqin/images/' + id,
    method: 'get'
  })
}

// 新增每日图片
export function addImages(data) {
  return request({
    url: '/kaoqin/images',
    method: 'post',
    data: data
  })
}

// 修改每日图片
export function updateImages(data) {
  return request({
    url: '/kaoqin/images',
    method: 'put',
    data: data
  })
}

// 删除每日图片
export function delImages(id) {
  return request({
    url: '/kaoqin/images/' + id,
    method: 'delete'
  })
}
