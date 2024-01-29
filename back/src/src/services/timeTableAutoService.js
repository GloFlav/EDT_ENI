import moment from 'moment';
import { Horaire } from '../models/horaire';
import { Matiere } from '../models/matiere';
import { Param } from '../models/param';
import { Planification } from '../models/planification';
import { Semestre } from '../models/semestre';
import { defineSimpleDuration } from './dateTimeService';

export const checkValidMatiereDurationInDay = async (planification) => {
    return new Promise((resolve, reject) => {
        try {
            if ((await defineSimpleDuration(planification.heure_debut, planification.heure_fin)) === (moment.duration(await getDureeSeanceMatiere()).asMilliseconds())) {
                Horaire.getAll(horaires => {
                    for (const h of horaires) {
                        if (moment(planification.date).isSame(h.code_jour, 'day')
                            && (checkBetweenTime(h.heure_ouverture_matin, h.heure_cloture_matin, planification.heure_debut, planification.heure_fin) || checkBetweenTime(h.heure_ouverture_aprem, h.heure_cloture_aprem, planification.heure_debut, planification.heure_fin))) {
                            Planification.getByMatiereAndDate(planification.matiere_id, planification.date, async plan => {
                                if (plan.length > 0) {
                                    resolve(false);
                                } else {
                                    resolve(true);
                                }
                            })
                        } else {
                            resolve(false);
                        }
                    }
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

export const checkValidMatiereDurationInWeek = async (planification) => {
    return new Promise((resolve, reject) => {
        try {
            Planification.getByMatiereAndWeek(planification.matiere_id, planification.date, results => {
                if (results.length > 0) {
                    Matiere.getOne(planification.matiere_id, result => {
                        let frequence_hebdo = results.length;
                        (frequence_hebdo >= result.frequence_hebdo_max) ? resolve(false) : resolve(true);
                    })
                } else {
                    resolve(false);
                }
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

export const checkValidMatiereDurationInSemestre = async (semestre_id) => {
    return new Promise((resolve, reject) => {
        try {
            Matiere.getBySemestre(semestre_id, result => {
                if (result.length > 0) {
                    let workDuration;
                    for (let i = 0; i < result.length; i++) {
                        workDuration += moment.duration(await getDureeSeanceMatiere()).asHours();
                    }
                    workDuration < result.total_heure ? resolve(result.total_heure - workDuration) : resolve(true);
                } else {
                    resolve(false);
                }
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

export const distingPlanificationInstance = async () => {

}

export const getDaysBetweenDates = async (startDate, endDate) => {
    return new Promise((resolve, reject) => {
        try {
            let firstDate = moment(startDate).clone();
            let dates = [];

            while (firstDate.isSameOrBefore(endDate)) {
                dates.push(firstDate.format('MM/DD/YYYY'));
                firstDate.add(1, 'days');
            }
            resolve(dates);
        }
        catch (e) {
            reject(e);
        }
    })
};

export const checkBetweenTime = async (startTime, endTime, startWorkTime, endWorkTime) => {
    return new Promise((resolve, reject) => {
        try {
            let format = 'hh:mm';
            let startOfWork = moment('09:34', format);
            let endOfWork
            let start = moment(startTime, format);
            let finish = moment(endTime, format);
            moment().isBetween(start, finish, null, '[]')
        }
        catch (e) {
            reject(e)
        }
    })
}

export const getDureeSeanceMatiere = async () => {
    return new Promise((resolve, reject) => {
        try {
            Param.getAll(result => {
                resolve(result.duree_seance_matiere);
            })
        }
        catch (e) {
            reject(e);
        }
    })
}