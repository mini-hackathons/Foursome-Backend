const User = require('../models/User');
const Asset = require('../models/Asset');
const crud = require('../util/crud');

module.exports = {
    createAsset: (req, res) => {
        const assetId = req.ids[0];
        const imageUrl = req.awsUrls[0];

        const ownerId = req.user.id;
        const { name, description, price } = req.body;

        const asset = new Asset({
            _id: assetId,
            owner: ownerId,
            name,
            description,
            price,
            imageUrl
        });
        crud.createAndPush(res, asset, User, { _id: ownerId }, 'inventory');
    },
    getAllUserAssets: (req, res) => {
        const id = req.user.id;

        crud.findAndPopulate(res, User, id, 'inventory', '-_id inventory');
    }
}