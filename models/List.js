const mongoose = require('mongoose');
const itemSchema = require('./Item').schema;

const listSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'It needs a name!']
    },
    items: [itemSchema] // array of items
});

// Export item model
module.exports = mongoose.model('List', listSchema);