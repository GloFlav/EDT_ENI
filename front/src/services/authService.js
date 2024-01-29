import { approvProdServer } from '../config/axiosConfig'

export const login = async(user) => {
    return new Promise((resolve, reject) => {
        try {
            approvProdServer.post('/login', user).then(res => {
                if (res.data.accessToken) resolve(res.data.accessToken);
                else reject(res.data);
            }).catch(err => reject(err))
        }
        catch(e) {
            reject(e)
        }
    })
}

export const logout = (cb) => {
    localStorage.removeItem('user_info');
    cb()
}

export const guardRoute = (to, from, next) => {
    if(localStorage.getItem('user_info')) {
        next();
    } else {
        next('/login');
    }

}