const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'It needs a name!']
    }
});

// Export item model
module.exports = {
    schema: itemSchema,
    model: mongoose.model('Item', itemSchema)
}