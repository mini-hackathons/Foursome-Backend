const User = require('../models/User');
const crud = require('../util/crud');

module.exports = {
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
        const { email, password } = req.body;

        const user = new User({ email, password });
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
                coordinates: [ location.longitude, location.latitude ]
            }
        };
        crud.update(res, User, query, update);
    },
    likeUser: async(req, res) => {
        const { currentUserId } = req.user;
        const { otherUserId } = req.body;

        let resData = {};

        // Update currentUser map
        const currentUser = await User.findById(currentUserId);
        currentUser.likedUsers.set(otherUserId, Date.now());
        const saveRes = await currentUser.save();
        resData = { ... resData, ...saveRes };

        // Check if otherUser also liked currentUser,
        // if so, then add each user to the other's matchList
        const otherUser = await User.findById(otherUserId);
        if(otherUser.likedUsers.get(currentUserId)){
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
        const { passedUserId } = req.body;

        // Update passedUsers map
        // and save
        const currentUser = await User.findOne(req.user);
        currentUser.passedUsers.set(passedUserId, Date.now());
        const save = await currentUser.save();

        res.status(200).send({
            data: save
        });
    },
    getNearbyUsers: async(req, res) => {
        try{
            const { radius } = req.body;
            console.log("USER----------------------------")
            console.log(req.user);
            const currentUser = await User.findOne(req.user);
            console.log(currentUser)
            const { location, likedUsers, passedUsers } = currentUser;

            console.log('-----------');
            console.log(location)
            console.log(likedUsers)
            console.log(passedUsers)
            console.log('-----------');

            const nearbyUsers = await User.find({
                location: {
                    $near: {
                        $maxDistance: radius,
                        $geometry: location
                    }
                }
            }).select('_id');
            
            console.log(nearbyUsers);

            const newUsers = nearbyUsers.filter(
                user =>
                    !likedUsers.get(user._id) &&
                    !passedUsers.get(user._id) &&
                    !user._id.equals(currentUser._id)                    
            )
    
            res.status(200).send({
                data: newUsers
            });
        }catch(err) {
            console.log(err);
            res.status(401).send(err);
        }

    }
}