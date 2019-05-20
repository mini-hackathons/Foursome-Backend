const assetCtrl = require('../controllers/assetCtrl');
const { isAuthenticated, uploadToAws } = require('../util/customMiddleware');

const maxFileSize = 2;
const maxFields = 3;
const exposeSingleFile = require('../util/multer').getMulterSingle(maxFileSize, maxFields);

module.exports = (router) => {
    router
        .route('/create-asset')
        .post(
            isAuthenticated,
            exposeSingleFile,
            uploadToAws,
            assetCtrl.createAsset
        );

    router
        .route('/all-assets')
        .get(assetCtrl.getAllUserAssets);
}