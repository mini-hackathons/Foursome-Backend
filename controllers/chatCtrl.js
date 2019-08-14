const User = require('../models/User');
const Asset = require('../models/Asset');
const crud = require('../util/crud');

const chatSocket = require('../SocketIO/chatSocket');

module.exports = {
    updateFcmToken: async(req, res) => {
        const { fcmToken } = req.body;

        try {

            console.log('Update Fcm Token route');
            console.log(req.user);

            const query = { _id: req.user._id };
            const update = { fcmToken };

            crud.update(res, User, query, update);

        }catch(err) {
            console.log(err);
            res.status(400).send(err);
        }
    },
    getMessages: (req, res) => {

    },
    sendMessage: (req, res) => {
        chatSocket.sendMessage('Hi');
    }
}