const mongoose = require('mongoose')

const chatSchema = mongoose.Schema(
    {
        userId: { type: String },
        roomId: { type: String },
        text: {
            type: String,
        },
        date: {
            type: String,
        },
        isRead: {
            type: Boolean,
        },
    },
    { timestamps: true }
)

const Chat = mongoose.model('Chat', chatSchema)
module.exports = Chat
