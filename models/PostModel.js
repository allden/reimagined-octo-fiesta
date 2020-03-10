const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const opts = {toJSON: { virtuals: true }, versionKey: false, id: false};

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    content: {
        type: String, 
        required: true
    },
    timeOfCreation: {
        type: Date, 
        default: new Date()
    },
    published: {
        type: Boolean, 
        default: false
    }
}, opts);

PostSchema.virtual('url').get(function() {
    return '/posts/' + this._id;
});

module.exports = mongoose.model('Post', PostSchema);