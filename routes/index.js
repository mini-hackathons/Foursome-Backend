const user = require('./user');
const asset = require('./asset');
const login = require('./login');
const chat = require('./chat');

module.exports = (router) => {
    user(router);
    asset(router);
    login(router);
    chat(router);
}