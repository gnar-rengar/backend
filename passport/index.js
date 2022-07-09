const passport = require('passport')
const User = require('../schemas/user')

const kakao = require('./kakaoStrategy')
const google = require('./googleStrategy')
const naver = require('./naverStrategy')
const discord = require('./discordStrategy')

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.userId)
    })

    passport.deserializeUser((id, done) => {
        User.findOne({ userId: id })
            .then((user) => done(null, user))
            .catch((err) => done(err))
    })

    kakao()
    google()
    naver()
    discord()
}
