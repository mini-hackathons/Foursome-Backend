const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

let TokenSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: { 
            type: String,
            required: true,
            maxLength: 45,
            minLength: 1
        },
        token: {
            type: String,
            required: true
        },
        expirationDate: Date,
    }
);

TokenSchema.pre('save', function(next) {
    let now = new Date();
    this.expirationDate = now.setHours(now.getHours() + 12);

    console.log(this.expirationDate);

    next();
});

TokenSchema.methods.expired = function() {
    return Date.now() > this.expirationDate;
};

module.exports = mongoose.model('Token', TokenSchema);