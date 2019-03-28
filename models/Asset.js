const mongoose = require('mongoose');

let AssetSchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: {
            type: String,
            required: true,
            maxLength: 45,
            minLength: 1
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        description: {
            type: String,
            maxLength: 500,
            minLength: 1
        },
        imageUrl: {
            type: String,
            required: true
        },
        price: { 
            type: Number,
            required: true
        },        
    },
    // Adds only createdAt field
    {
        timestamps: { createdAt: true, updatedAt: false }
    }
);

module.exports = mongoose.model('Asset', AssetSchema);