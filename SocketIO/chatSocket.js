module.exports = (socket, emitEvent, getOnlineUsers) => {
    console.log('Init Chat Socket');
    
    // LISTEN FOR EVENTS 

    socket.on('chat-message-from-sender', (data) => {
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
        if(!userSocketIds)
            console.log('Push Notif Chat');
        // Send to all open sockets
        else {
            console.log('Socket IO Chat');

            // Emit
            userSocketIds.forEach(id => emitEvent(id, 'chat-message-to-recipient', data));
        }
    });
}
