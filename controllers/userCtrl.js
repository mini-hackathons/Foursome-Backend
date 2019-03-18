const User = require('../models/User');
const crud = require('../util/crud');

module.exports = {
    dTest: (req, res) => {
        res.status(200).send('Good')
    },
    createUser: (req, res) => {
        const { email, password } = req.body;

        const user = new User({
            email,
            password
        });
        crud.create(res, user);
    },
    getAllUsers: (req, res) => {
        crud.findAll(res, User);
    },
    deleteUser: (req, res) => {
        crud.delete(res, User, req.user.id);
    }
}