const axios = require('axios')
const passport = require('passport')
const DiscordStrategy = require('passport-discord').Strategy
const User = require('../schemas/user')
require('dotenv').config()

const riotToken = process.env.riotTokenKey

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
                    const exUser = await User.findOne({
                        socialId: profile.id,
                        social: 'discord',
                    })
                    if (exUser) {
                        const lolNickname = exUser.lolNickname

                        if (exUser.lolNickname) {
                            const summoner = await axios({
                                method: 'GET',
                                url: encodeURI(
                                    `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${lolNickname}`
                                ),
                                headers: {
                                    'X-Riot-Token': riotToken,
                                },
                            })

                            const leaguePoint = await axios({
                                method: 'GET',
                                url: encodeURI(
                                    `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.data.id}`
                                ),
                                headers: {
                                    'X-Riot-Token': riotToken,
                                },
                            })

                            const soloPoint = leaguePoint.data.find(
                                (x) => x.queueType == 'RANKED_SOLO_5x5'
                            )
                            const leaguePoints =
                                soloPoint.tier +
                                ' ' +
                                soloPoint.rank +
                                ' ' +
                                soloPoint.leaguePoints

                            await User.updateOne(
                                { socialId: profile.id, social: 'discord' },
                                { $set: { leaguePoints } }
                            )
                        }

                        done(null, exUser)
                    } else {
                        let nickname = profile.username //profile.nickname 맞는지 확인해야함
                        if (profile.username.length > 8) {
                            nickname = profile.username.substr(0, 8)
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
