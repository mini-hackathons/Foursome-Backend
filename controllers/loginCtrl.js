const User = require('../models/User');
const Token = require('../models/Token');
const Test = require('../models/Test');

const passport = require('passport');
const uuidv4 = require('uuid/v4');
const mailer = require('../util/email');
const jwtSigner = require('../util/jwt');
const crud = require('../util/crud');

const axios = require('axios');

module.exports = {
    testToken: async(req, res) => {
        try {
            let userDoc = await User.findOne({ username: 'Danny' }).select('_id');

            const token = await jwtSigner.createToken(
                {
                    user: {
                        _id: userDoc._id
                    }
                }
            );
            console.log(token)

            res.status(200).send(token);
        }catch(err) {
            console.log(err);
            res.status(400).send('Error');
        }
    },
    verifyJwt: async(req, res) => {
		try {
            const { token } = req.body;
            
            if(!token) throw new Error('No jwt found');
		    const payload = await jwtSigner.verifyToken(token);

		    console.log(payload);

		    res.status(200).send('Successfully verified JWT');
		}catch(err) {
	    	console.log(err);
		}
    },
    getTestJwt: async(req, res) => {
        const { username } = req.body;

        try {
            let userDoc = await User.findOne({ username }).select('_id');
            if(!userDoc){
                const user = new User({
                    username,
                    // REMOVE THIS AFTER TESTING
                    location: {
                        type: 'Point',
                        coordinates: [ -118.243683, 34.0522 ]
                    }
                });
                userDoc = await user.save();
            }

            jwtSigner.createAndSendToken(
                {
                    user: {
                        _id: userDoc._id
                    }
                }, res);
        }catch(err) {
            console.log(err);
            res.status(502).send(err);
        }
    },
    getFBJwt: async (req, res) => {
        const { inputToken, fbId } = req.body;
        console.log(fbId);

        try{
            const askFB = await axios.get(`https://graph.facebook.com/debug_token?input_token=${inputToken}&access_token=2330978563812210|CP2gkbSpAacivV73crP6bJ7WCms`);
            const { is_valid, app_id, user_id } = askFB.data.data;
            console.log(is_valid);
            console.log(app_id === process.env.FB_APP_ID);
            console.log(user_id);
            
            // Validate
            if(is_valid && app_id === process.env.FB_APP_ID && user_id === fbId){
                let userDoc = await User.findOne({ facebookId: fbId }).select('_id');
                console.log('--------------------');
                console.log(userDoc);
                
                // Create new user
                if(!userDoc) {
                    const user = new User({ facebookId: fbId });
                    userDoc = await user.save();
                    console.log('------------------');
                    console.log(fbId);
                }
                
                jwtSigner.createAndSendToken(
                    {
                        user: {
                            _id: userDoc._id,
                            facebookId: fbId
                        }
                    }, res);
            }else{
                throw new Error('Invalid user input token!');
            }
        }catch(err) {
            console.log(err);
            res.status(502).send('Failed');
        }
    },
    facebookCallback: (req, res) => {
	    res.status(200).send('Thank you for logging in.')
    },
    jwt: (req, res) => {
        const payload = {
            userId: 'Daniel'
        };

        const i = 'Foursome';
        const s = 'Daniel';
        const a = 'FoursomeApp'
        const signOptions = {
            issuer: i,
            subject: s,
            audience: a,
            expiresIn: '7d',
            algorithm: 'RS256'
        }

        const token = jwt.sign(payload, privateKey, signOptions);
        console.log(token);

        res.send(token)
    },
    a: async (req, res) => {
        try {
            // const test = new Test({ name: 'test', _id: ObjectId('123')});
            await test.save();

            const a = await Test.findOne({ name: 'test' });
            console.log(a._id)
        }catch(err) {
            console.log(err);
        }
    },
    test: async(req, res, next) => {
        // const { formData } = req.body;

        res.send('Good send');
    },
    passportLogin: async (req, res, next) => {
        try{
            await passport.authenticate('local', {
                // successRedirect: '/profile',
                failureFlash: true
            });
            
            next();
        }catch(err) {
            console.log(err);
        }

    },
    login: async (req, res) => {
        res.status(200).send('Successully signed in!');
    },
    loginRedirect: async (req, res) => {
        res.redirect('http://localhost:3001/profile');
    },
    
    signUp: async(req, res) => {
        try {
            const { email, password } = req.body;

            const existingToken = await Token.find({ email });
            if(existingToken.length) throw new Error('This email has already requested to create an account! Please check your email and verify the acccount.');

            const existingUser = await User.find({ email });
            if(existingUser.length) throw new Error('This email has already been verified!');

            // Else create
            const token = uuidv4();
            const unverifiedUser = new Token({
                email,
                password,
                token
            });

            // Check for error sending email
            mailer.send(
                email,
                'Verify account',
                '',
                `<a href=http://localhost:3000/verify/${email}/${token}>Verify account</a>`
            );

            crud.create(res, unverifiedUser);
        }catch(err) {
            res.status(500).send(`Error: ${err}`);
        }
    },
    verify: async(req, res, next) => {
        try {
            const { email, token } = req.params;

            // Check if user already verified
            const existingUser = await User.findOne({ email });
            if(existingUser) throw new Error('Account has already been verified!');
    
            // Find user to verify
            const unverifiedUser = await Token.findOne({ email, token });

            // Invalid
            if(!unverifiedUser) return res.status(401).send('Invalid credentials');
            if(unverifiedUser.expired()) return res.status(401).send('Verification email has expired');
    
            // Else verify/create User
            const user = new User({ email, password: unverifiedUser.password });
            await user.save();
            await Token.deleteOne({ email, token });

            req.body = {
                username: email,
                password: unverifiedUser.password
            };

            // Login
            next();
        }catch(err) {
            console.log(err);
            res.status(500).send({ err });
        }
    },
    reset: async (req, res) => {
        try{

            res.status(201).send({
                calendarData
            });
        }catch(err){
            res.status(404).send({
                err
            });
        }
    }
}

// try{
//     const { userId } = req.body;

//     const sql = `SELECT lastAttempt FROM password WHERE userid = ${userId})`;
//     const queryResult = await connection.query(sql, (err, result) => {
//         if(err) throw err;

//         console.log(result);
//     });

//     res.status(201).send({
//         queryResult
//     });
// }catch(err) {
//     res.status(404).send({
//         err
//     });
// }

