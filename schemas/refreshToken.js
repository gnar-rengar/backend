const mongoose = require("mongoose")

const refreshTokenSchema = new mongoose.Schema({
    userId: { type: String },
    agent: { type: String },
    refreshToken: { type: String },
})


const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema)
module.exports = RefreshToken