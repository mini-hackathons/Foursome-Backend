const admin = require("firebase-admin");

module.exports = () => {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: 'https://foursome-ebe6a.firebaseio.com'
      });
}