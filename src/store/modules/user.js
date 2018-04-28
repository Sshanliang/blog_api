import {login, logout, getInfo} from '@/api/login'
import {getToken, setToken, removeToken} from '@/utils/auth'

import api from '@/utils/api'
let that = this;
const user = {
    state: {
        token: getToken(),
        name: '',
        avatar: '',
        roles: [],
        id:''
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_ID:(state,id)=>{
            state.id=id
        }

    },

    actions: {
        // 获取当前页id

        getID({commit},id){
            commit('SET_ID', id)
        },

        // 登录
        // Login({commit}, userInfo) {
        //     const username = userInfo.username.trim()
        //
        //     return new Promise((resolve, reject) => {
        //         login(username, userInfo.password).then(response => {
        //
        //             console.log(response)
        //
        //             const data = response.data
        //             setToken(data.token)
        //             commit('SET_TOKEN', data.token)
        //             resolve()
        //         }).catch(error => {
        //
        //             reject(error)
        //         })
        //     })
        // },

        Login({commit}, userInfo) {
            const username = userInfo.username.trim()
            api.post('user/token',
                {
                    'ac':username,
                    'se':userInfo.password
                },(success)=>{
                    const data = success.data
                    setToken(data.token)
                    commit('SET_TOKEN', data.token)
                },(fail)=>{
                    console.log(fail)
                }

                )

        },

        // 获取用户信息
        GetInfo({commit, state}) {
            return new Promise((resolve, reject) => {
                getInfo(state.token).then(response => {
                    const data = response.data
                    commit('SET_ROLES', data.roles)
                    commit('SET_NAME', data.name)
                    commit('SET_AVATAR', data.avatar)
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 登出
        LogOut({commit, state}) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    commit('SET_TOKEN', '')
                    commit('SET_ROLES', [])
                    removeToken()
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 前端 登出
        FedLogOut({commit}) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                removeToken()
                resolve()
            })
        }
    }
}

export default user
