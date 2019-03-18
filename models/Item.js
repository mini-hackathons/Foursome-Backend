const mongoose = require('mongoose');

let ItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            maxLength: 45,
            minLength: 1
        },
        description: {
            type: String,
            maxLength: 500,
            minLength: 1
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

module.exports = mongoose.model('Item', ItemSchema);