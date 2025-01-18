import request from '@/utils/request'

// 查询学生考勤详细列表
export function listStudentAttendance(query) {
  return request({
    url: '/kaoqin/studentAttendance/list',
    method: 'get',
    params: query
  })
}

// 查询学生考勤详细详细
export function getStudentAttendance(id) {
  return request({
    url: '/kaoqin/studentAttendance/' + id,
    method: 'get'
  })
}

// 新增学生考勤详细
export function addStudentAttendance(data) {
  return request({
    url: '/kaoqin/studentAttendance',
    method: 'post',
    data: data
  })
}

// 修改学生考勤详细
export function updateStudentAttendance(data) {
  return request({
    url: '/kaoqin/studentAttendance',
    method: 'put',
    data: data
  })
}

// 删除学生考勤详细
export function delStudentAttendance(id) {
  return request({
    url: '/kaoqin/studentAttendance/' + id,
    method: 'delete'
  })
}
