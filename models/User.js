const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 11;

let UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            sparse: true,
            maxLength: 45,
            minLength: 1
        },
        facebookId: {
            type: String,
            unique: true
        },
        location: {
            type: { type: String },
            coordinates: []
        },
        email: {
            type: String,
            // required: true,
            unique: true,
        },
        password: { 
            type: String,
            // required: true,
            maxLength: 45,
            minLength: 1
        },
        lastSigninAttempt: Number,

        // friends: [
        //     {
        //         type: mongoose.Schema.Types.ObjectId,
        //         ref: 'User'
        //     }
        // ],
        inventory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Asset'
            }
        ],
        // posts: [
        //     {
        //         type: mongoose.Schema.Types.ObjectId,
        //         ref: 'Post'
        //     }
        // ]
        
    },
    // Adds only createdAt field
    {
        timestamps: { createdAt: true, updatedAt: false }
    }
);

UserSchema.index({ location: "2dsphere" });

/*
UserSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.password, saltRounds);
    this.password = hash;

    next();
});
*/

UserSchema.methods.waitToSignin = function() {
    return 500 < Date.now() - this.lastSigninAttempt;
};
UserSchema.methods.validPassword = async function(password) {
    this.lastSigninAttempt = Date.now();
    return await bcrypt.compare(password, this.password);
};

// For when searching by username
// Searches by name, returns all with name
// UserSchema.index({ name: 1 });

module.exports = mongoose.model('User', UserSchema);