const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

module.exports = (passport) => {
    passport.use(new LocalStrategy(
      async (username, password, done) => {
        try{
            const user = await User.findOne({$or: [
                { email: username },
                { username }
            ]});

            if(!user) return done(null, false, { message: 'Incorrect username' });

            if(user.waitToSignin()) return done(null, false, { message: 'Please wait to sign in' });

            if(!await user.validPassword(password)) return done(null, false, { message: 'Incorrect password' });

            return done(null, user);
        }catch(err) {
            return done(err);
        }
      }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}
