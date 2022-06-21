const passport = require('passport')
const KakaoStrategy = require('passport-kakao').Strategy
const { Users } = require('../models/index')
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
                    const exUser = await Users.findOne({
                        where: { socialId: profile.id, social: 'kakao' },
                    })
                    if (exUser) {
                        done(null, exUser)
                    } else {
                        let nickname = profile._json.properties.nickname
                        if (profile._json.properties.nickname.length > 8) {
                            nickname = profile._json.properties.nickname.substr(
                                0,
                                8
                            )
                        }
                        const newUser = await Users.create({
                            social: 'kakao',
                            socialId: profile.id,
                            nickname,
                            profileUrl: profile._json.properties.profile_image,
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
