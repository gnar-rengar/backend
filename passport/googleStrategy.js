const axios = require('axios')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../schemas/user')
require('dotenv').config()

const riotToken = process.env.riotTokenKey

module.exports = () => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_ID,
                clientSecret: process.env.GOOGLE_SECRET,
                callbackURL: process.env.GOOGLE_URL,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const exUser = await User.findOne({
                        socialId: profile.id,
                        social: 'google',
                    })
                    if (exUser) {
                        const lolNickname = exUser.lolNickname
                        let tier = ''
                        let rank = ''
                        let leaguePoints = ''

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

                            if (soloPoint) {
                                tier = soloPoint.tier
                                rank = soloPoint.rank
                                leaguePoints = soloPoint.leaguePoints
                            } else {
                                tier = 'UNRANKED'
                                rank = ''
                                leaguePoints = ''
                            }

                            await User.updateOne(
                                { socialId: profile.id, social: 'google' },
                                { $set: { tier, rank, leaguePoints } }
                            )
                        }

                        if(exUser.firstLogin !== true && exUser.firstLogin !== false) {
                            await User.updateOne(
                                { socialId: profile.id, social: 'naver' },
                                { $set: { firstLogin: true } }
                            )
                        }

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
                            firstLogin: true,
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
