const User = require('../models/User');
const Chat = require('../models/Chat');
const crud = require('../util/crud');
const MILES2METERS = 1609.344;


module.exports = {
    createTestChat: async (req, res) => {
        const { _id: member } = req.user;

        try {
            const chat = await Chat.findOrCreate([ member ]);
            console.log(chat);
            
            res.status(201).send(chat);
        }catch(err) {
            console.log(err);
            res.status(400).send(err);
        }
    },
    test: async (req, res) => {
        try {
            const { _id: author } = req.user;
            const body = 'test body';
            const chat = await Chat.findOrCreate([ author ]);
            console.log(chat)
            
            for(let i = 0; i < 10; i++){
                await chat.saveMessage(author, body+i);
            }
                
            res.status(200).send('Successfully saved message!');
        }catch(err) {
            console.log(err)
            res.status(400).send(err);
        }
    },
    getChatPage: async (req, res) => {
        const { _id: userId } = req.user;
        let { pageNumbers } = req.body;

        console.log(pageNumbers)

        try{
            const chat = await Chat.findOrCreate([ userId ]);

            let messageList = [];
            // First page may have fewer messages, so grab next page too
            if(JSON.stringify(pageNumbers) === '[0]') pageNumbers = [ 0, 1 ];

            pageNumbers.forEach(num => {
                const messages = chat.getPage(num)
                messageList = messageList.concat(messages);
            });
            
            console.log(messageList);

            res.status(200).send(messageList);

        }catch(err) {
            console.log(err);
            res.status(400).send(err);
        }
    },
    getProfile: (req, res) => {
        crud.findAndPopulate(res, User, req.user.id, 'inventory', '-password');
    },
    getAllUsers: (req, res) => {
        crud.findAll(res, User);
    },
    deleteUser: (req, res) => {
        crud.delete(res, User, req.user.id);
    },
    createUser: (req, res) => {
        const { email, password, location } = req.body;

        const user = new User({ email, password,
            location: {
                type: 'Point',
                coordinates: [ location.long, location.lat ]
            }
        });
        crud.create(res, user);
    },
    updateLocation: (req, res) => {
        const { location } = req.body;

        console.log('In update location route');
        console.log(location);

        const query = { ...req.user };
        const update = {
            location: {
                type: 'Point',
                coordinates: [ location.long, location.lat ]
            }
        };
        crud.update(res, User, query, update);
    },
    likeUser: async(req, res) => {
        try {

        }catch(err) {
            console.log
        }
        const { _id: currentUserId } = req.user;
        const { otherUserId } = req.body;

        let resData = {};

        // Update currentUser map
        const currentUser = await User.findById(currentUserId);
        
        // With Map Type
        // currentUser.likedUsers.set(otherUserId, Date.now());

        // With Mixed Type
        // Prevent duplicates
        if(currentUser.likedUsers && currentUser.likedUsers[otherUserId] || currentUser.passedUsers && currentUser.passedUsers[otherUserId]){
            throw new Error('User already liked or passed!');
        }
        currentUser.likedUsers[otherUserId] = Date.now();
        currentUser.markModified('likedUsers');
        const saveRes = await currentUser.save();
        
        resData = { ... resData, ...saveRes };

        // Check if otherUser also liked currentUser,
        // if so, then add each user to the other's matchList
        const otherUser = await User.findById(otherUserId);
        if(otherUser.likedUsers[currentUserId]){
            console.log('Match!!!!!!!!!!!!!!');
            const updateCurrentUser = await crud.updateAndReturn(User, { _id: currentUserId }, { $push: { matchList: otherUserId } });
            const updateOtherUser = await crud.updateAndReturn(User, { _id: otherUserId }, { $push: { matchList: currentUserId } });

            resData = { ... resData, ...updateCurrentUser, ...updateOtherUser };
        }

        res.status(200).send({
            data: resData
        });
    },
    passUser: async(req, res) => {
        try{
            const { otherUserId } = req.body;
            // Update passedUsers map
            // and save
            const currentUser = await User.findOne(req.user);

            // With Map Type
            // currentUser.passedUsers.set(otherUserId, Date.now());
    
            // With Mixed Type
            // Prevent duplicates
            if(currentUser.likedUsers && currentUser.likedUsers[otherUserId] || currentUser.passedUsers && currentUser.passedUsers[otherUserId]){
                throw new Error('User already liked or passed!');
            }
            currentUser.passedUsers[otherUserId] = Date.now();
            currentUser.markModified('passedUsers');
            const save = await currentUser.save();
    
            res.status(200).send({
                data: save
            });
        }catch(err) {
            console.log(err);
            res.status(400).send(err);
        }
    },
    getNearbyUsers: async(req, res) => {
        try{
            const { radius } = req.body;
            const radiusMeters = MILES2METERS * radius;
            console.log("USER----------------------------")
            console.log(req.user);
            const currentUser = await User.findOne(req.user);
            console.log(currentUser)
            const { location } = currentUser;

            console.log('-----------');
            console.log(location)
            console.log('-----------');

            const MAX_USERS = 2;
            let newUsers = [];

            // Get cursor object
            // Manually iterate and filter through documents
            const cursor = await User.find({
                location: {
                    $near: {
                        $maxDistance: radiusMeters,
                        $geometry: location
                    }
                },
            })
            .cursor()

            for(let user = await cursor.next(); newUsers.length < MAX_USERS && user !== null; user = await cursor.next()){
                // Check if user already swiped
                if(!currentUser.likedUsers[user._id] &&
                !currentUser.passedUsers[user._id] &&
                !user._id.equals(currentUser._id)){
                    // Add User / Increment for loop
                    newUsers.push(user);
                }
            }
        
            console.log('----')

            console.log('----')

            if(newUsers.length === 0) newUsers = 'None'
    
            res.status(200).send({
                data: newUsers
            });
        }catch(err) {
            console.log(err);
            res.status(401).send(err);
        }

    }
}