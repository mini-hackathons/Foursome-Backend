const itemCtrl = require('../controllers/itemCtrl');
const { loggedIn } = require('../util/customMiddleware');

module.exports = (router) => {
    router
        .route('/create-item')
        .post(loggedIn, itemCtrl.createItem);

    router
        .route('/all-items')
        .get(itemCtrl.getAllUserItems);
}