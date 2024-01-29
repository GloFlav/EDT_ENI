import axios from 'axios';

export const backServer = axios.create({
    baseURL : "http://localhost:7007/"
})

// approvProdServer.interceptors.request.use(config => {
//     console.log('Conf1', config);
//     let user_token = localStorage.getItem('user_info');
//     if (user_token) {
//         config.headers['Authorization'] = `Bearer ${user_token}`;
//     }
//     return config;
//     }, error => {
//         return Promise.reject(error);
// })

