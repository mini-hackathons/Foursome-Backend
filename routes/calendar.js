const calendarCtrl = require('../controllers/calendarCtrl');

module.exports = (router) => {
    router
        .route('/get-calendar')
        .get(calendarCtrl.getCalendar);
    router
        .route('/update-calendar')
        .post(calendarCtrl.updateCalendar);
}