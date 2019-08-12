module.exports = (socket, emitEvent, getOnlineUsers) => {
    console.log('Init Chat Socket');
    
    // LISTEN FOR EVENTS 

    socket.on('chat-message-init', (data) => {
        console.log(this.socket.id);
        console.log(data);
        
        const onlineUsers = getOnlineUsers();

        const userId = data.userId;
        const userSocketIds = onlineUsers[userId];

        // No open sockets
        if(!userSocketIds)
            console.log('Push Notif Chat');
        // Send to all open sockets
        else {
            console.log('Socket IO Chat');

            // Emit
            userSocketIds.foreach(id => emitEvent(id, 'chat-message-recipient', data));
        }
    });
}

// EMIT EVENTS

emitMessage: (socket, data) => {


}