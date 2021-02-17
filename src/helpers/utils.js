const moment = require('moment');

export function formatDate(date) {
    if (date) {
        return moment(date)
            .format('YYYY-MM-DD');
    }
    return '';
}

export function formatDateTime(dateTime) {
    if (!dateTime) return null;
    let formatedDateTime = dateTime.length < 11 ? `${dateTime} 00:00:00+0900` : dateTime;
    formatedDateTime = moment(formatedDateTime).startOf('day');
    return formatedDateTime;
}
