import request from '@/utils/request'

// 查询学生管理列表
export function listStudent(query) {
    return request({
        url: '/kaoqin/student/list',
        method: 'get',
        params: query
    })
}

export function listStudent1(query) {
    return request({
        url: '/kaoqin/student/list1',
        method: 'get',
        params: query
    })
}


// 查询学生管理详细
export function getStudent(id) {
    return request({
        url: '/kaoqin/student/' + id,
        method: 'get'
    })
}

// 新增学生管理
export function addStudent(data) {
    return request({
        url: '/kaoqin/student',
        method: 'post',
        data: data
    })
}

// 修改学生管理
export function updateStudent(data) {
    return request({
        url: '/kaoqin/student',
        method: 'put',
        data: data
    })
}

// 删除学生管理
export function delStudent(id) {
    return request({
        url: '/kaoqin/student/' + id,
        method: 'delete'
    })
}
