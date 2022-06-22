const passport = require('passport')
// const { Users } = require('../models/index')

const kakao = require('./kakaoStrategy')
// const google = require('./googleStrategy')
const naver = require('./naverStrategy')

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.userId)
    })

    passport.deserializeUser((id, done) => {
        Users.findOne({ where: { userId: id } })
            .then((user) => done(null, user))
            .catch((err) => done(err))
    })

    kakao()
    google()
    naver()
}