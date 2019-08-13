const User = require('../models/User');
import * as admin from "firebase-admin";

module.exports = (socket, emitEvent, getOnlineUsers) => {
    console.log('Init Chat Socket');
    
    // LISTEN FOR EVENTS 

    socket.on('chat-message-from-sender', async(data) => {
        console.log(socket.id);
        console.log(data);
        
        const onlineUsers = getOnlineUsers();

        const userId = data.userId;
        const userSocketIds = onlineUsers[userId];

console.log('Online Users');
console.log(onlineUsers);
console.log('UserSocketIds');
console.log(userSocketIds);

        // No open sockets
        if(!userSocketIds) {
            console.log('Push Notif Chat');

            const fcmToken = await User.findById(userId).select('fcmToken');
            console.log('Fcm Token');
            console.log(fcmToken);

            // Use Fcm to send to Client
            var message = {
                data,
                token: fcmToken
            };
              
            // Send a message to the device corresponding to the provided
            // registration token.
            try {
                // Response is a message ID string.
                const messageId = await admin.messaging().send(message)

                console.log('Successfully sent message:', messageId);

            }catch(err) {
                console.log('Error sending message:', err);
            }

        }else {
        // Send to all open sockets
            console.log('Socket IO Chat');

            // Emit
            userSocketIds.forEach(id => emitEvent(id, 'chat-message-to-recipient', data));
        }
    });
}
