const mongoose = require('mongoose');

const TokensSchema = new mongoose.Schema({
    token: { 
        type: String, 
        required: true,
    },
    user: {
        type: String, 
        required: true,
    },
    revoked: {
        type: Boolean,
        default: false,
    },
    createdOn: {
        type: Date, 
        default: Date.now,
    },
    updatedOn: {
        type: Date,
    },
});

module.exports = mongoose.model('Tokens', TokensSchema);;