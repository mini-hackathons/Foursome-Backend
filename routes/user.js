const userCtrl = require('../controllers/userCtrl');
const { loggedIn } = require('../util/customMiddleware');

module.exports = (router) => {
    router
        .route('/profile')
        .get(loggedIn, userCtrl.getProfile);

    router
        .route('/all-users')
        .get(userCtrl.getAllUsers);

    router
        .route('/delete-user')
        .delete(loggedIn, userCtrl.deleteUser);
    router
        .route('/create-user')
        .post(userCtrl.createUser);
}