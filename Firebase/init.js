const admin = require("firebase-admin");

module.exports = () => {
    // Initialize the default app
    console.log('INIT FIREBASE APP');
    var app = admin.initializeApp();
}