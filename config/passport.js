const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');
const Token = require('../models/Token');

const FacebookStrategy = require('passport-facebook');
const axios = require('axios');

module.exports = (passport) => {
    passport.use(new FacebookStrategy({
        clientID: process.env.FB_APP_ID,
        clientSecret: process.env.FB_APP_SECRET,
        callbackURL: 'localhost:3000/login/facebook-callback',
        // profileFields: ['id', 'displayName', 'photos', 'email'],
        enableProof: true
    },
    async (accessToken, refreshToken, profile, cb) => {
        try {
            // Find
            let user = await User.findOne({ facebookId: profile.id });

            // Or create new
            if(!user) {
                const newUser = new User({
                    name: 'test'
                });

                await newUser.save();
                user = await User.findOne({ facebookId: profile.id });
            }

            console.log(user);
            return cb(err, user);
        }catch(err) {
            console.log(err);
        }
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
        });
        
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}
