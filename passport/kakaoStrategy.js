const axios = require('axios')
const passport = require('passport')
const KakaoStrategy = require('passport-kakao').Strategy
const User = require('../schemas/user')
require('dotenv').config()

const riotToken = process.env.riotTokenKey

module.exports = () => {
    passport.use(
        new KakaoStrategy(
            {
                clientID: process.env.KAKAO_ID,
                callbackURL: process.env.KAKAO_URL,
            },

            async (accessToken, refreshToken, profile, done) => {
                try {
                    const exUser = await User.findOne({
                        socialId: profile.id,
                        social: 'kakao',
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
                            
                            if (soloPoint) {
                                const tier = soloPoint.tier
                                const rank = soloPoint.rank
                                const leaguePoints = soloPoint.leaguePoints
                    
                                data.tier = tier
                                data.rank = rank
                                data.leaguePoints = leaguePoints
                            } else {
                                const tier = 'unranked'
                                const rank = ''
                                const leaguePoints = ''
                    
                                data.tier = tier
                                data.rank = rank
                                data.leaguePoints = leaguePoints
                            }

                            await User.updateOne(
                                { socialId: profile.id, social: 'kakao' },
                                { $set: { tier, rank, leaguePoints } }
                            )
                        }

                        done(null, exUser)
                    } else {
                        let nickname = profile._json.properties.nickname
                        if (profile._json.properties.nickname.length > 8) {
                            nickname = profile._json.properties.nickname.substr(
                                0,
                                8
                            )
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
