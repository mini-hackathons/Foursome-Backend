const mongoose = require('mongoose');

let TestSchema = new mongoose.Schema(
    {
        name: String  
    }
);

module.exports = mongoose.model('Test', TestSchema);