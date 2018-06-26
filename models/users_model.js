const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');

const config = require("../config");

const UsersSchema = new mongoose.Schema({
    uuid: { 
        type: String, 
        required: true,
        default: uuidv4,
    },
    full_name: {
        type: String, 
        required: true,
    },
    email: {
        type: String, 
        required: true,
        unique: true,
    },
    password: {
        type: String, 
        required: true,
    },
    salt: {
        type: String, 
        required: true,
    },
    alg: {
        type: String, 
        required: true,
    },
    createdOn: {
        type: Date, 
        default: Date.now,
    },
    updatedOn: {
        type: Date,
    },
});

UsersSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(config.mongoose.SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            user.salt = salt;
            user.alg = "bcrypt";
            next();
        });
    });
});

UsersSchema.methods.comparePassword = (candidatePassword, cb) => {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('Users', UsersSchema);;