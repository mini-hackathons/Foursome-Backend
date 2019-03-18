const user = require('./user');
const item = require('./item');
const login = require('./login');

module.exports = (router) => {
    user(router);
    item(router);
    login(router);
}