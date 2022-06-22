const passport = require('passport')
const GoogleStrategy = require("passport-google-oauth20").Strategy
const { User } = require('../schemas/user')
require('dotenv').config()

module.exports = () => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
                callbackURL: "http://localhost:8080/auth/google/callback",
                passReqToCallback: true,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const exUser = await Users.findOne( { socialId: profile.id, social: 'google' } )
                    if (exUser) {
                        done(null, exUser)
                    } else {
                        let nickname = profile.nickname //profile.nickname 맞는지 확인해야함
                        if (profile.nickname.length > 8) {
                            nickname = profile.nickname.substr(0, 8)
                        }
                        const newUser = await Users.create({
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