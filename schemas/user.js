const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    social: { type: String },
    socialId: { type: String, unique: true },
    profileUrl: { type: String },
    nickname: { type: String, required: true },
    lolNickname: { type: String, unique: true },
    playStyle: { type: [Number] },
    position: { type: [String] },
    voice: { type: [String] },
    communication: { type: [Number] }
})


const User = mongoose.model("User", userSchema)
module.exports = User