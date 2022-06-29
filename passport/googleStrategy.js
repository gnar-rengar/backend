const passport = require('passport')
const GoogleStrategy = require("passport-google-oauth20").Strategy
const User = require('../schemas/user')
require('dotenv').config()

module.exports = () => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_ID,
                clientSecret: process.env.GOOGLE_SECRET,
                callbackURL: process.env.GOOGLE_URL,
                passReqToCallback: true,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const exUser = await User.findOne( { socialId: profile.id, social: 'google' } )
                    if (exUser) {
                        done(null, exUser)
                    } else {
                        let nickname = profile.nickname //profile.nickname 맞는지 확인해야함
                        if (profile.nickname.length > 8) {
                            nickname = profile.nickname.substr(0, 8)
                        }
                        const newUser = await User.create({
                            social: 'google',
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