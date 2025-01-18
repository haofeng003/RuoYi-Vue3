import request from '@/utils/request'

// 查询班级管理列表
export function listClazz(query) {
    return request({
        url: '/kaoqin/clazz/list',
        method: 'get',
        params: query
    })
}

// 查询班级管理详细
export function getClazz(id) {
    return request({
        url: '/kaoqin/clazz/' + id,
        method: 'get'
    })
}

// 新增班级管理
export function addClazz(data) {
    return request({
        url: '/kaoqin/clazz',
        method: 'post',
        data: data
    })
}

// 修改班级管理
export function updateClazz(data) {
    return request({
        url: '/kaoqin/clazz',
        method: 'put',
        data: data
    })
}


// 转班
export function clazzZhuanBan(data) {
    return request({
        url: '/kaoqin/clazz/zhuanban',
        method: 'put',
        data: data
    })
}


// 删除班级管理
export function delClazz(id) {
    return request({
        url: '/kaoqin/clazz/' + id,
        method: 'delete'
    })
}
