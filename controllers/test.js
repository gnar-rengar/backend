const axios = require('axios')
const User = require('../schemas/user')
const Chat = require('../schemas/chat')
const ChatRoom = require('../schemas/chatroom')
require('dotenv').config()

const riotToken = process.env.riotTokenKey

async function test(req, res) {
    const plz = 'plz'

    res.cookie('plz', plz)
}

module.exports = {
    test,
}
