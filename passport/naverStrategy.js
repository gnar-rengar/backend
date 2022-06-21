const passport = require('passport')
const {
    Strategy: NaverStrategy,
    Profile: NaverProfile,
} = require('passport-naver-v2')
const { Users } = require('../models/index')
require('dotenv').config()

module.exports = () => {
    passport.use(
        new NaverStrategy(
            {
                clientID: process.env.NAVER_ID,
                clientSecret: process.env.NAVER_SECRET,
                callbackURL: process.env.NAVER_URL,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const exUser = await Users.findOne({
                        where: { socialId: profile.id, social: 'naver' },
                    })
                    if (exUser) {
                        done(null, exUser)
                    } else {
                        let nickname = profile.nickname
                        if (profile.nickname.length > 8) {
                            nickname = profile.nickname.substr(0, 8)
                        }
                        const newUser = await Users.create({
                            social: 'naver',
                            socialId: profile.id,
                            nickname,
                            profileUrl: profile.profileImage,
                        })
                        done(null, newUser)
                    }
                } catch (error) {
                    console.error(error)
                    done(error)
                }
            }
        )
    )
}
