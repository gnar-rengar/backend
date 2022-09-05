const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        social: { type: String },
        socialId: { type: String, unique: true },
        tier: { type: String },
        rank: { type: String },
        leaguePoints: { type: String },
        profileUrl: { type: String },
        nickname: { type: String },
        lolNickname: { type: String },
        playStyle: { type: [String] },
        position: { type: [String] },
        useVoice: { type: Boolean },
        voiceChannel: { type: [String] },
        communication: { type: String },
        // banId: { type: [String] },
        todaysCustom: { type: [String] },
        customDate: { type: String },
        isOnBoarded: { type: Boolean, default: false },
        phoneNumber: { type: String },
        agreeSMS: { type: Boolean }
    },
    { timestamps: true }
)

const User = mongoose.model('User', userSchema)
module.exports = User
