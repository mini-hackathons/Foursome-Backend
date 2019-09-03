const mongoose = require('mongoose');
const MONGO_PATH = process.env.MONGODB_URI || 'mongodb://localhost:27017/foursome';

const connectToMongo = async () => {

    try {
        await mongoose.connect(MONGO_PATH, {
            useNewUrlParser: true,
            useCreateIndex: true
        });
        console.log('Mongo connected!');
    }catch(err) {
        console.log(`Error: ${err}`);
    }
}

module.exports = connectToMongo;