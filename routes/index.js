const user = require('./user');
const asset = require('./asset');
const login = require('./login');

module.exports = (router) => {
    user(router);
    asset(router);
    login(router);
}