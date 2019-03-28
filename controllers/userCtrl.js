const User = require('../models/User');
const crud = require('../util/crud');

module.exports = {
    getProfile: (req, res) => {
        crud.findAndPopulate(res, User, req.user.id, 'inventory', '-password');
    },
    getAllUsers: (req, res) => {
        crud.findAll(res, User);
    },
    deleteUser: (req, res) => {
        crud.delete(res, User, req.user.id);
    },
    createUser: (req, res) => {
        const { email, password } = req.body;

        const user = new User({ email, password });
        crud.create(res, user);
    }
}