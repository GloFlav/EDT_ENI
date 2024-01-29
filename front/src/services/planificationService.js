import { backServer } from '../config/axiosConfig'

export const createPlanification = async (data) => {
    return new Promise((resolve, reject) => {
        try {
            backServer.post(`/planification`, data)
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

export const readPlanification = async (data) => {
    return new Promise((resolve, reject) => {
        try {
            backServer.get(`/planifications?parcours_id=${data.parcours_id}&niveau_id=${data.niveau_id}&intervalle_id=${data.intervalle_id}`)
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

export const readSalleLibre = async (data) => {
    return new Promise((resolve, reject) => {
        try {
            backServer.get(`/salle_libre?id=${data.id}&groupe_id=${data.groupe_id}&niveau_id=${data.niveau_id}&intervalle_id=${data.intervalle_id}&jour_id=${data.jour_id}&heure_id=${data.heure_id}&matiere_id=${data.matiere_id}&bool=${data.bool}`)
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

export const readMatiere = async (niveau_id, parcours_id) => {
    return new Promise((resolve, reject) => {
        try {
            backServer.get(`/matieres_planification?niveau_id=${niveau_id}&parcours_id=${parcours_id}`)
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

export const readGroupe = async (niveau_id, parcours_id) => {
    return new Promise((resolve, reject) => {
        try {
            backServer.get(`/groupes_planification?niveau_id=${niveau_id}&parcours_id=${parcours_id}`)
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

export const updatePlanification = async (data) => {
    return new Promise((resolve, reject) => {
        try {
            console.log('Intervaly', data);
            backServer.put(`/planification`, data)
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

export const deletePlanification = async (id) => {
    return new Promise((resolve, reject) => {
        try {
            backServer.delete(`/planification/${id}`)
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