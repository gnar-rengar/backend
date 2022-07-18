const mongoose = require('mongoose')

const chatSchema = mongoose.Schema({
    userId: { type: [String] },
    text: {
        type: String,
        required: true,
    },
    date: {
        type: String,
    },
    timestamps: true,
    isRead: {
        type: Boolean
    },
})

module.exports = mongoose.model('chat', chatSchema)
