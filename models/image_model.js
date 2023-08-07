const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String},
    likes: {type: Number, default: 0},
    comments: [{text: String}],
    imageUrl: {type: String, required: true}
});

const ImageModel = mongoose.model('Image', imageSchema)

module.exports = ImageModel;