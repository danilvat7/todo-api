const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        minlength: 1,
        
        validate: {
            validator: validator.isEmail,
            message: `{VALUE} is not valid email`
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

module.exports = {
    User
};