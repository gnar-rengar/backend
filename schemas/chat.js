const mongoose = require('mongoose')

const chatSchema = mongoose.Schema({
    socialId: {
        type: String,
        required: true,
        unique: true,
    },
    nickname: {
        type: String,
        required: true,
    },
    profileUrl: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    date: {
        type: String,
    },
})

module.exports = mongoose.model('chat', chatSchema)
