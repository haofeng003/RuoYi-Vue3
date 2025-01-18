import {getInfo, login, logout} from '@/api/login'
import {getToken, removeToken, setToken} from '@/utils/auth'

const useUserStore = defineStore(
    'user',
    {
        state: () => ({
            token: getToken(),
            id: '',
            name: '',
            avatar: '',
            roles: [],
            permissions: []
        }),
        actions: {
            // 登录
            login(userInfo) {
                const username = userInfo.username.trim()
                const password = userInfo.password
                const code = userInfo.code
                const uuid = userInfo.uuid
                const ip = userInfo.ip
                return new Promise((resolve, reject) => {
                    login(username, password, code, uuid, ip).then(res => {
                        setToken(res.token)
                        this.token = res.token
                        resolve()
                    }).catch(error => {
                        reject(error)
                    })
                })
            },
            // 获取用户信息
            getInfo() {
                return new Promise((resolve, reject) => {
                    getInfo().then(res => {
                        const user = res.user
                        // const avatar = (user.avatar == "" || user.avatar == null) ? defAva : import.meta.env.VITE_APP_BASE_API + user.avatar;
                        const avatar = 'https://kaoqinjinan.oss-cn-qingdao.aliyuncs.com/kaoqin/2025/01/02/67760890e4b0fbd0e600df4a.jpg';

                        if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
                            this.roles = res.roles
                            this.permissions = res.permissions
                        } else {
                            this.roles = ['ROLE_DEFAULT']
                        }
                        this.id = user.userId
                        this.name = user.userName
                        this.avatar = avatar
                        resolve(res)
                    }).catch(error => {
                        reject(error)
                    })
                })
            },
            // 退出系统
            logOut() {
                return new Promise((resolve, reject) => {
                    logout(this.token).then(() => {
                        this.token = ''
                        this.roles = []
                        this.permissions = []
                        removeToken()
                        resolve()
                    }).catch(error => {
                        reject(error)
                    })
                })
            }
        }
    })

export default useUserStore
