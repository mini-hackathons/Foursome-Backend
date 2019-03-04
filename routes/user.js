const userCtrl = require('../controllers/userCtrl');

module.exports = (router) => {
    router
        .route('/test')
        .get(userCtrl.test);
    router
        .route('/create-user')
        .post(userCtrl.createUser);
    router
        .route('/add-friend')
        .post(userCtrl.addFriend);
    router
        .route('/:id/get-friends')
        .get(userCtrl.getFriends);
    router
        .route('/connect-calendar')
        .post(userCtrl.connectCalendar);
}