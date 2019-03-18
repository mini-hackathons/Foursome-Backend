const userCtrl = require('../controllers/userCtrl');
const { loggedIn } = require('../util/customMiddleware');

module.exports = (router) => {
    router
        .route('/create-user')
        .post(userCtrl.createUser);

    router
        .route('/all-users')
        .get(userCtrl.getAllUsers);

    router
        .route('/delete-user')
        .delete(loggedIn, userCtrl.deleteUser);
    router
        .route('/dtest')
        .delete(userCtrl.dTest);
}