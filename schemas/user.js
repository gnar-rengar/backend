const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    social: { type: String },
    socialId: { type: String, unique: true },
    leaguePoints: { type: String },
    profileUrl: { type: String },
    nickname: { type: String, required: true },
    lolNickname: { type: String, unique: true },
    playStyle: { type: [String] },
    position: { type: [String] },
    voice: { type: Boolean },
    voiceChannel: { type: [String] },
    communication: { type: String },
    banId: { type: [String] },
})

const User = mongoose.model('User', userSchema)
module.exports = User
