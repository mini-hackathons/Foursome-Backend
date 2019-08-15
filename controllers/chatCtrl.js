const User = require('../models/User');
const Chat = require('../models/Chat');
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
    getMessages: async(req, res) => {
        const userId = req.user._id;
        const { chatId, chatPage } = req.body;
        
        try {
            const chat = await Chat.findUserChat(userId, chatId);
            const page = await chat.getPage(chatPage);

            res.status(200).send(page);

        }catch(err) {
            console.log(err);
            res.status(400).send(err);
        }
    },
    sendMessage: (req, res) => {
        chatSocket.sendMessage('Hi');
    }
}