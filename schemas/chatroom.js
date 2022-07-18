const mongoose = require('mongoose')

const chatroomSchema = mongoose.Schema({
    userId: { type: [String] },
})

module.exports = mongoose.model('chatroom', chatroomSchema)
