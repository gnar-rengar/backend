const mongoose = require('mongoose')

const chatSchema = mongoose.Schema({
    userId: { type: String },
    text: {
        type: String,
        required: true,
    },
    date: {
        type: String,
    },
    isRead: {
        type: Boolean
    },
}, { timestamps: true } )

module.exports = mongoose.model('chat', chatSchema)
