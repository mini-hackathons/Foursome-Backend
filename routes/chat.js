const chatCtrl = require('../controllers/chatCtrl');
const { isAuthenticated } = require('../util/customMiddleware');

module.exports = (router) => {
    router
        .route('/chat/get-messages')
        .get(chatCtrl.getMessages);

    router
        .route('/chat/send-message')
        .post(chatCtrl.sendMessage);
}