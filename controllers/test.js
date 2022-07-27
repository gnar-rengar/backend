const axios = require('axios')
const User = require('../schemas/user')
const Chat = require('../schemas/chat')
const ChatRoom = require('../schemas/chatroom')
require('dotenv').config()

const riotToken = process.env.riotTokenKey

async function test(req, res) {
    const userId = '62d509be151f1fb3b2e0f792'
    const currentUser = await User.findOne({ _id: userId })
    const playStyle = currentUser.playStyle
    console.log(playStyle)

    // const list = await User.aggregate([
    //     { $match: { playStyle: { $in: playStyle } }},
    // ])

    const list = await User.find({
        playStyle: { $in: playStyle },
    })
    console.log(list)

    res.send({ success: true })
}

module.exports = {
    test
}
