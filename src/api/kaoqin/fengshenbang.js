import request from '@/utils/request'

// 查询封神榜图列表
export function listFengshenbang(query) {
    return request({
        url: '/kaoqin/fengshenbang/list',
        method: 'get',
        params: query
    })
}

// 查询封神榜图列表
export function listFengshenbang1(query) {
    return request({
        url: '/kaoqin/fengshenbang/list1',
        method: 'get',
        params: query
    })
}


// 查询封神榜图详细
export function getFengshenbang(studentId) {
    return request({
        url: '/kaoqin/fengshenbang/' + studentId,
        method: 'get'
    })
}

// 新增封神榜图
export function addFengshenbang(data) {
    return request({
        url: '/kaoqin/fengshenbang',
        method: 'post',
        data: data
    })
}

// 修改封神榜图
export function updateFengshenbang(data) {
    return request({
        url: '/kaoqin/fengshenbang',
        method: 'put',
        data: data
    })
}

// 删除封神榜图
export function delFengshenbang(studentId) {
    return request({
        url: '/kaoqin/fengshenbang/' + studentId,
        method: 'delete'
    })
}
