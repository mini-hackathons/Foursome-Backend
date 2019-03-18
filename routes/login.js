const passport = require('passport');

const loginCtrl = require('../controllers/loginCtrl');

module.exports = (router) => {
    router
        .route('/test')
        .post(loginCtrl.test);
    router
        .route('/login')
        .get(loginCtrl.getLogin);
    router.post('/logout', function(req, res){
        try{
            req.logOut();
            req.session.destroy( function ( err ) {
                res.clearCookie('connect.sid', {path: '/'});

                res.status(200).send("Successfully logged Out");
            });
        }catch(err){
            res.status(401).send("Failed to Log out");
        }
    });
    router
        .route('/login')
        .post(
            passport.authenticate('local', {
                failureFlash: true
            }),
            loginCtrl.login
        );
    router
        .route('/reset')
        .post(loginCtrl.reset);
}