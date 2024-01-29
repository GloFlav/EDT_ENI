import { backServer } from '../config/axiosConfig'

export const createEntity = async (entitySubUrl, data) => {
    return new Promise((resolve, reject) => {
        try {
            backServer.post(`/${entitySubUrl}`, data)
            .then(res => resolve({
                successResponse : res.data
            }))
            .catch(err => resolve({
                errorResponse : err
            }))
        }
        catch (e) {
            reject
        }
    })
}

export const readEntity = async (entitySubUrl) => {
    return new Promise((resolve, reject) => {
        try {
            backServer.get(`/${entitySubUrl}`)
            .then(res => resolve({
                data : res.data.data
            }))
            .catch(err => resolve({
                errorResponse : err
            }))
        }
        catch (e) {
            reject(e)
        }
    })
}

export const updateEntity = async (entitySubUrl, id, data) => {
    return new Promise((resolve, reject) => {
        try {
            backServer.put(`/${entitySubUrl}/${id}`, data)
            .then(res => resolve({
                successResponse : res.data
            })
            )
            .catch(err => resolve({
                errorResponse : err
            }))
        }
        catch (e) {
            reject(e)
        }
    })
}

export const deleteEntity = async (entitySubUrl, id) => {
    return new Promise((resolve, reject) => {
        try {
            backServer.delete(`/${entitySubUrl}/${id}`)
            .then(res => resolve({
                successResponse : res.data
            }))
            .catch(err => resolve({
                errorResponse : err
            }))
        }
        catch (e) {
            reject(e)
        }
    })
}