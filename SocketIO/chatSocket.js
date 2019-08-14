const User = require('../models/User');
const admin = require("firebase-admin");

module.exports = (socket, emitEvent, getOnlineUsers) => {
    console.log('Init Chat Socket');

    this.emitEvent = emitEvent;
    this.getOnlineUsers = getOnlineUsers;
    
    // LISTEN FOR EVENTS 

    socket.on('chat-message-from-sender', async(data) => {
        console.log(socket.id);
        console.log(data);
        
        const recipients = data.userIds;
        const msg = data.message;
        recipients.forEach(userId => sendMessageToUser(userId, msg));
    });
}

const sendMessageToUser = async(userId, msg) => {
    // Can optimize this in future
    const onlineUsers = this.getOnlineUsers();
    const userSocketIds = onlineUsers[userId];

        // No open sockets
        if(!userSocketIds) {
            console.log('Push Notif Chat');

            try{
                await pushToClient(userId, msg);
            }catch(err) {
                console.log(err);
            }

        }else {
        // Send to all open sockets
        
            // Emit
            console.log('Socket IO Chat');
            userSocketIds.forEach(id => this.emitEvent(id, 'chat-message-to-recipient', msg));


            try{
                await pushToClient(userId, msg);
            }catch(err) {
                console.log(err);
            }
        }
}

const pushToClient = async(userId, msg) => {
    const user = await User.findById(userId);
    console.log('User');
    console.log(user);

    const { fcmToken } = await User.findById(userId).select('fcmToken');
    console.log('Fcm Token');
    console.log(fcmToken);

    // Use Fcm to send to Client
    const payload = {
        data: {
            message: msg
        },
        token: fcmToken
    };
        
    // Send a message to the device corresponding to the provided
    // registration token.
    try {
        // Response is a message ID string.
        setInterval(async() => {
            try {
                const messageId = await admin.messaging().send(payload)
                console.log('Successfully sent message:', messageId);
            }catch(err) {
                console.log(err);
            }
        }, 2000);


    }catch(err) {
        console.log("Error with FCM");
        console.log('Error sending message:', err);
    }
}
