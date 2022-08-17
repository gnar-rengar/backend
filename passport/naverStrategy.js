const axios = require('axios')
const passport = require('passport')
const {
    Strategy: NaverStrategy,
    Profile: NaverProfile,
} = require('passport-naver-v2')
const User = require('../schemas/user')
require('dotenv').config()

const riotToken = process.env.riotTokenKey

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
                    const exUser = await User.findOne({
                        socialId: profile.id,
                        social: 'naver',
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
                                { socialId: profile.id, social: 'naver' },
                                { $set: { tier, rank, leaguePoints } }
                            )
                        }

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
