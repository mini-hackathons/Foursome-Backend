const passport = require('passport');
// const upload = multer({ dest: 'uploads/' });
const loginCtrl = require('../controllers/loginCtrl');

const { login, loggedIn } = require('../util/customMiddleware');

module.exports = (router) => {
    router
        .route('/test-middleware')
        .post(loginCtrl.testMiddleware);
    router
		.route('/login/verify-jwt')
		.post(
			loginCtrl.verifyJwt
		);
    router
		.route('/login/get-fb-jwt')
		.post(loginCtrl.getFBJwt);
    router
        .route('/login/facebook-login')
        .get(passport.authenticate('facebook'));

    router
        .route('/login/facebook-callback')
        .get(loginCtrl.facebookCallback);

    router
        .route('/jwt')
        .post(loginCtrl.jwt);

    router
        .route('/a')
        .post(loginCtrl.a);

    router
        .route('/test')
        .post(
            loggedIn,
            loginCtrl.test
        );

    
    router
        .route('/login')
        .post(
            passport.authenticate('local', {
                // successRedirect: '/profile',
                failureFlash: true
            }),
            loginCtrl.login
        );
    router
        .route('/signup')
        .post(loginCtrl.signUp);

    router
        .route('/verify/:email/:token')
        .get(
            loginCtrl.verify,
            passport.authenticate('local', {
                // successRedirect: '/profile',
                failureFlash: true
            }),
            loginCtrl.loginRedirect
        );

    router.post('/logout', function(req, res){
        try {
            req.logout();
            req.session.destroy( function ( err ) {
                if(!err) {
                    res.status(200).clearCookie('connect.sid', {path: '/'}).send("Successfully logged Out");
                }else {
                    console.log(err)
                    res.status(500).send(err);
                }

            });
        }catch(err){
            res.status(401).send("Failed to Log out");
        }
    });

    router
        .route('/reset')
        .post(loginCtrl.reset);
}
