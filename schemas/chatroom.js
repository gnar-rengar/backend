const mongoose = require('mongoose')

const chatroomSchema = mongoose.Schema(
    { userId: { type: [String] } },
    { timestamps: true }
)

const ChatRoom = mongoose.model('Chatroom', chatroomSchema)
module.exports = ChatRoom
