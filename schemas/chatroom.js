const mongoose = require('mongoose')

const chatroomSchema = mongoose.Schema({ userId: { type: [String] } })

const ChatRoom = mongoose.model('Chatroom', chatroomSchema)
module.exports = ChatRoom
