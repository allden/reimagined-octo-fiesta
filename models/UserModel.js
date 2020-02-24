const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const opts = {toJSON: { virtuals: true }, versionKey: false, id: false};

const UserSchema = new Schema({
    firstName: {
        type: String, 
        required: true
    },
    lastName: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        lowercase: true, 
        required: true
    },
    password: {
        type: String, 
        required: true
    }
});

UserSchema.virtual('getFullName').get(function() {
    return this.firstName + ' ' + this.lastName;
});

UserSchema.pre('save', function(next) {
    this.firstName = this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1).toLowerCase();
    this.lastName = this.lastName.charAt(0).toUpperCase() + this.lastName.slice(1).toLowerCase();
    next();
}, opts);

module.exports = mongoose.model('User', UserSchema);