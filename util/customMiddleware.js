module.exports = {
    loggedIn: (req, res, next) => {
        if (req.user) {
            next();
        } else {
            res.status(401).send('Please login');
        }
    }
}