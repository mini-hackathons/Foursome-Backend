const userCtrl = require('../controllers/userCtrl');
const { isAuthenticated } = require('../util/customMiddleware');

module.exports = (router) => {
    router
        .route('/create-test-chat')
        .post(userCtrl.createTestChat);

    router
        .route('/test')
        .post(userCtrl.test);

    router
        .route('/get-chat-page')
        .get(userCtrl.getChatPage);

    router
        .route('/profile')
        .get(isAuthenticated, userCtrl.getProfile);

    router
        .route('/all-users')
        .get(userCtrl.getAllUsers);

    router
        .route('/delete-user')
        .delete(isAuthenticated, userCtrl.deleteUser);
    router
        .route('/create-user')
        .post(userCtrl.createUser);

    router
        .route('/like-user')
        .post(userCtrl.likeUser);
    router
        .route('/pass-user')
        .post(userCtrl.passUser);

    router
        .route('/update-location')
        .post(userCtrl.updateLocation);
    
    router
        .route('/get-nearby-users')
        .post(userCtrl.getNearbyUsers);
}