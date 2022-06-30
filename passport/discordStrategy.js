const passport = require('passport')
const DiscordStrategy = require("passport-discord").Strategy
const User = require('../schemas/user')
require('dotenv').config()

module.exports = () => {
    passport.use(
        new DiscordStrategy(
            {
                clientID: process.env.DISCORD_ID,
                clientSecret: process.env.DISCORD_SECRET,
                callbackURL: process.env.DISCORD_URL,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const exUser = await User.findOne( { socialId: profile.id, social: 'discord' } )
                    if (exUser) {
                        done(null, exUser)
                    } else {
                        let nickname = profile.nickname //profile.nickname 맞는지 확인해야함
                        if (profile.nickname.length > 8) {
                            nickname = profile.nickname.substr(0, 8)
                        }
                        const newUser = await User.create({
                            social: 'discord',
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