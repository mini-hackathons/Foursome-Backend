const { verifyToken } = require('../util/jwt');
const client = require('../Databases/redis').getClient();

const markUserOnline = async (user, socket) => {
    const userId = user._id;

    // If empty
    if(!this.onlineUsers[userId]) this.onlineUsers[userId] = new Set();

    this.onlineUsers[userId].add(socket.id);

    // With Redis
    // await client.sadd(`onlineUsers:${userId}`, socketId);
}
const markUserOffline = async (socket) => {
    console.log(socket);
    this.onlineUsers[socket.userId].delete(socket.id);

    // With Redis
    // await client.srem(`onlineUsers:${userId}`, socketId);
}
const getUserSockets = async (userId) => {
    return this.onlineUsers[userId].values();

    // With Redis
    // const sockets = await client.smembers(`onlineUsers:${userId}`);
}

// Instance methods
this.onlineUsers = {};
this.getOnlineUsers = () => this.onlineUsers;

module.exports = (server) => {
    const io = require('socket.io')(server);

    io
    // Auth middleware
    .use(async (socket, next) => {
        try {
            const token = socket.handshake.query.token;

            if(token){
                const { user } = await verifyToken(token);

                // Maintain connection
                if(user){
                    console.log('Successfully verified token for SocketIO connection');

                    markUserOnline(user, socket);
                    // Add userId to socket
                    // Can use id to remove socketId from Active Sockets on Disconnect
                    socket.userId = user._id;

                    return next();
                }
            }

        }catch(err) {
            console.log('Error in SocketIO Connection middleware');
            console.log(err);
        }

        // Terminate connection
        console.log('Disconnecting socket');
        socket.disconnect();
    })
    .on('connection', (socket) => {
        console.log('Initializing SocketIO');

        const emitEvent = (socketId, eventName, data) => {
            io.to(`${socketId}`).emit(eventName, data);
        }
        
        require('./chatSocket')(socket, emitEvent, this.getOnlineUsers);

        setInterval(() => console.log(this.getOnlineUsers()), 2000);


        socket.on('disconnect', (reason) => {
            console.log('Disconnected');
    
            markUserOffline(socket);
            
            // Remove from database
            // database.remove(socket.userId)
    
            if (reason === 'io server disconnect') {
                // the disconnection was initiated by the server, you need to reconnect manually
                socket.connect();
            }
        });
    });
}
