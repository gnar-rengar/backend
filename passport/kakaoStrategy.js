const passport = require('passport')
const KakaoStrategy = require('passport-kakao').Strategy
const User = require('../schemas/user')
require('dotenv').config()

module.exports = () => {
    passport.use(
        new KakaoStrategy(
            {
                clientID: process.env.KAKAO_ID,
                callbackURL: process.env.KAKAO_URL,
            },

            async (accessToken, refreshToken, profile, done) => {
                try {
                    const exUser = await User.findOne( { socialId: profile.id, social: 'kakao' } )
                    if (exUser) {
                        done(null, exUser)
                    } else {
                        let nickname = profile._json.properties.nickname
                        if (profile._json.properties.nickname.length > 8) {
                            nickname = profile._json.properties.nickname.substr(0, 8)
                        }
                        const newUser = await User.create({
                            social: 'kakao',
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
