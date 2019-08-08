const User = require('../models/User');
const Asset = require('../models/Asset');
const crud = require('../util/crud');

const chatSocket = require('../SocketIO/chatSocket');

module.exports = {
    getMessages: (req, res) => {

    },
    sendMessage: (req, res) => {
        chatSocket.sendMessage('Hi');
    }
}