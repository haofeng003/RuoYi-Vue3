import request from '@/utils/request'

// 查询班级考勤详细列表
export function listClassAttendance(query) {
    return request({
        url: '/kaoqin/classAttendance/list',
        method: 'get',
        params: query
    })
}

// 首页饼图数据
export function getGoodsList1(query) {
    return request({
        url: '/kaoqin/classAttendance/data',
        method: 'get',
        params: query
    });
}

// 查询班级考勤详细详细
export function getClassAttendance(id) {
    return request({
        url: '/kaoqin/classAttendance/' + id,
        method: 'get'
    })
}

// 新增班级考勤详细
export function addClassAttendance(data) {
    return request({
        url: '/kaoqin/classAttendance',
        method: 'post',
        data: data
    })
}

// 修改班级考勤详细
export function updateClassAttendance(data) {
    return request({
        url: '/kaoqin/classAttendance',
        method: 'put',
        data: data
    })
}

// 删除班级考勤详细
export function delClassAttendance(id) {
    return request({
        url: '/kaoqin/classAttendance/' + id,
        method: 'delete'
    })
}
