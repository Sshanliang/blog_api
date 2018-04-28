import request from '@/utils/request'


export function login(username, password) {

    return request({
        url: '/user/token',
        method: 'post',

        data: {
            'ac':username,
            'se':password
        }
    })
}

export function getInfo(token) {
    return request({
        url: '/token/info',
        method: 'post',
        params: { token }
    })
}

export function logout() {
    return request({
        url: '/user/logout',
        method: 'post'
    })
}
