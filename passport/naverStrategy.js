const passport = require('passport')
const {
    Strategy: NaverStrategy,
    Profile: NaverProfile,
} = require('passport-naver-v2')
const User = require('../schemas/user')
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
                    const exUser = await User.findOne( { socialId: profile.id, social: 'naver' } )
                    if (exUser) {
                        done(null, exUser)
                    } else {
                        let nickname = profile.nickname
                        if (profile.nickname.length > 8) {
                            nickname = profile.nickname.substr(0, 8)
                        }
                        const newUser = await User.create({
                            social: 'naver',
                            socialId: profile.id,
                            nickname,
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
