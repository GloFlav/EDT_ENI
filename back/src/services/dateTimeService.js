import moment from 'moment';

export const defineSimpleDuration = async(startTime, endTime) => {
    return new Promise ((resolve, reject) => {
        try {
            resolve(moment.utc(moment.duration(moment(endTime, 'HH:mm').diff(moment(startTime, 'HH:mm'))).asMilliseconds()));
        } catch(e) {
            reject(e);
        }
    })
}

export const defineDurationWithPause = (startTime, endTime, pause) => {
    return new Promise ((resolve, reject) => {
        try {
            resolve(moment.utc(moment.duration(moment(endTime, 'HH:mm').diff(moment(startTime, 'HH:mm'))).add(moment.duration(moment(pause, 'HH:mm'))).asMilliseconds()));
        } catch(e) {
            reject(e);
        }
    })
}
