import request from '@/utils/request'


// 查询学生考勤详细列表
export function listStudentAttendance(query) {
    return request({
        url: '/kaoqin/tongji/list',
        method: 'get',
        params: query
    })
}