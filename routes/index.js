const user = require('./user');
const calendar = require('./calendar');

module.exports = (router) => {
    user(router);
    calendar(router);
}