const mongoose = require('mongoose')

const chatroomSchema = mongoose.Schema({
    userId: { type: [String] },
})

const Chatroom = mongoose.model('Chatroom', chatroomSchema)
module.exports = Chatroom
