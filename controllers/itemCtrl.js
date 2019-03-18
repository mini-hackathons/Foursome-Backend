const User = require('../models/User');
const Item = require('../models/Item');
const crud = require('../util/crud');

module.exports = {
    createItem: (req, res) => {
        const userId = req.user.id;
        const { name, description, price } = req.body;

        const item = new Item({
            name,
            description,
            price
        });
        crud.createAndPush(res, item, User, { _id: userId }, 'inventory');
    },
    getAllUserItems: (req, res) => {
        const id = req.user.id;

        crud.findAndPopulate(res, User, id, 'inventory', 'inventory');
    }
}