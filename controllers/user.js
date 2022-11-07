const axios = require('axios')
const User = require('../schemas/user')
const Review = require('../schemas/review')
const Improvement = require('../schemas/improvement')
require('dotenv').config()
const fs = require('fs')
const chapmions = fs.readFileSync('datas/champions.json', 'utf8')
const perks = fs.readFileSync('datas/perks.json', 'utf8')
const queueTypes = fs.readFileSync('datas/queueTypes.json', 'utf8')
const spells = fs.readFileSync('datas/spells.json', 'utf8')
const CryptoJS = require('crypto-js')
const crypto = require('crypto')
const redis = require('../redis/redis').v4

const riotToken = process.env.riotTokenKey

async function writeReview(req, res) {
    const reviewedId = req.params.userId
    const reviewerId = res.locals.userId

    if (!reviewerId) {
        return res.status(401).json({
            message: '로그인이 필요합니다.',
        })
    }

    // const reviewerCheck = await Review.findOne({ reviewedId, reviewerId })
    // if(reviewerCheck) {
    //     return res.send({
    //         success: false,
    //         message: "이미 리뷰를 작성한 유저입니다."
    //     })
    // }

    const goodReview = req.body.goodReview
    const badReview = req.body.badReview
    const improvement = req.body.additionalBadReview

    try {
        const reviewedCheck = await Review.findOne({ reviewedId })
        if (reviewedCheck) {
            await Review.updateOne({ reviewedId }, { $push: { reviewerId } })
            for (let i = 0; i < goodReview.length; i++) {
                const descriptionCheck = await Review.findOne({
                    reviewedId,
                    'goodReview.description': goodReview[i],
                })
                if (descriptionCheck) {
                    await Review.updateOne(
                        {
                            reviewedId,
                            'goodReview.description': goodReview[i],
                        },
                        { $inc: { 'goodReview.$.count': 1 } }
                    )
                } else {
                    await Review.updateOne(
                        { reviewedId },
                        {
                            $push: {
                                goodReview: {
                                    description: goodReview[i],
                                    count: 1,
                                },
                            },
                        }
                    )
                }
            }
            for (let i = 0; i < badReview.length; i++) {
                const descriptionCheck = await Review.findOne({
                    reviewedId,
                    'badReview.description': badReview[i],
                })
                if (descriptionCheck) {
                    await Review.updateOne(
                        {
                            reviewedId,
                            'badReview.description': badReview[i],
                        },
                        { $inc: { 'badReview.$.count': 1 } }
                    )
                } else {
                    await Review.updateOne(
                        { reviewedId },
                        {
                            $push: {
                                badReview: {
                                    description: badReview[i],
                                    count: 1,
                                },
                            },
                        }
                    )
                }
            }
        } else {
            await Review.create({ reviewedId, reviewerId })
            for (let i = 0; i < goodReview.length; i++) {
                await Review.updateOne(
                    { reviewedId },
                    {
                        $push: {
                            goodReview: {
                                description: goodReview[i],
                                count: 1,
                            },
                        },
                    }
                )
            }
            for (let i = 0; i < badReview.length; i++) {
                await Review.updateOne(
                    { reviewedId },
                    {
                        $push: {
                            badReview: {
                                description: badReview[i],
                                count: 1,
                            },
                        },
                    }
                )
            }
        }

        // if (req.body.ban) {
        //     await User.updateOne(
        //         { _id: reviewerId },
        //         { $push: { banId: reviewedId } }
        //     )
        // }

        if (improvement) {
            await Improvement.create({ context: improvement })
        }

        res.status(200).send({
            message: '리뷰작성에 성공하였습니다.',
        })
    } catch (error) {
        console.log(error)
        res.send({
            message: '리뷰작성에 실패하였습니다.',
        })
    }
}

async function userInfo(req, res) {
    const userId = req.params.userId
    const goodReview = []

    try {
        const currentUser = await User.findOne({ _id: userId })
        const lolNickname = currentUser.lolNickname

        const summoner = await axios({
            method: 'GET',
            url: encodeURI(
                `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${lolNickname}`
            ),
            headers: {
                'X-Riot-Token': riotToken,
            },
        })

        const mostChampionList = await axios({
            method: 'GET',
            url: encodeURI(
                `https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summoner.data.id}`
            ),
            headers: {
                'X-Riot-Token': riotToken,
            },
        })

        let mostChampion = []

        if (mostChampionList.data.length !== 0) {
            const mostChampion1 = JSON.parse(chapmions).find(
                (x) => x.key == mostChampionList.data[0].championId
            ).id
            const mostChampion2 = JSON.parse(chapmions).find(
                (x) => x.key == mostChampionList.data[1].championId
            ).id
            const mostChampion3 = JSON.parse(chapmions).find(
                (x) => x.key == mostChampionList.data[2].championId
            ).id

            mostChampion.push(mostChampion1, mostChampion2, mostChampion3)
        }

        const review = await Review.findOne({ reviewedId: userId })
        if (review) {
            res.status(200).json({
                lolNickname,
                profileUrl: currentUser.profileUrl,
                tier: currentUser.tier,
                rank: currentUser.rank,
                leaguePoints: currentUser.leaguePoints,
                playStyle: currentUser.playStyle,
                position: currentUser.position,
                useVoice: currentUser.useVoice,
                voiceChannel: currentUser.voiceChannel,
                communication: currentUser.communication,
                mostChampion,
                goodReview: review.goodReview,
            })
        } else {
            res.status(200).json({
                lolNickname,
                profileUrl: currentUser.profileUrl,
                tier: currentUser.tier,
                rank: currentUser.rank,
                leaguePoints: currentUser.leaguePoints,
                playStyle: currentUser.playStyle,
                position: currentUser.position,
                useVoice: currentUser.useVoice,
                voiceChannel: currentUser.voiceChannel,
                communication: currentUser.communication,
                mostChampion,
                goodReview,
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            message: '유저정보 불러오기에 실패하였습니다.',
        })
    }
}

async function recentRecord(req, res) {
    const userId = req.params.userId
    const page = req.query.page
    const size = 5
    let recentRecord = []

    try {
        const cacheExist = await redis.exists(`${userId}/${page}`)

        if (cacheExist) {
            const cacheData = await redis.get(`${userId}/${page}`)

            res.status(200).json({
                recentRecord: JSON.parse(cacheData),
            })
        } else {
            const currentUser = await User.findOne({ _id: userId })
            const lolNickname = currentUser.lolNickname

            const summoner = await axios({
                method: 'GET',
                url: encodeURI(
                    `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${lolNickname}`
                ),
                headers: {
                    'X-Riot-Token': riotToken,
                },
            })

            const matchList = await axios({
                method: 'GET',
                url: encodeURI(
                    `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${summoner.data.puuid}/ids?start=0&count=100`
                ),
                headers: {
                    'X-Riot-Token': riotToken,
                },
            })

            if (matchList.data.length !== 0) {
                for (let i = (page - 1) * size; i < size * page; i++) {
                    let data = {}

                    const match = await axios({
                        method: 'GET',
                        url: encodeURI(
                            `https://asia.api.riotgames.com/lol/match/v5/matches/${matchList.data[i]}`
                        ),
                        headers: {
                            'X-Riot-Token': riotToken,
                        },
                    })

                    const myData = match.data.info.participants.filter(
                        (x) => x.puuid == summoner.data.puuid
                    )

                    data.gameMode = match.data.info.gameMode
                    data.gameType = match.data.info.gameType
                    data.queueType = JSON.parse(queueTypes).find(
                        (x) => x.queueId === match.data.info.queueId
                    ).description
                    data.gameStartTimestamp = match.data.info.gameStartTimestamp
                    data.gameEndTimestamp = match.data.info.gameEndTimestamp
                    data.win = myData[0].win
                    const champion = JSON.parse(chapmions).find(
                        (x) => x.key == myData[0].championId
                    )
                    data.championName = champion.id
                    data.championNameKR = champion.name
                    const primaryStyle = JSON.parse(perks).find(
                        (x) => x.id === myData[0].perks.styles[0].style
                    )
                    data.perk1 = primaryStyle.slots[0].runes.find(
                        (x) => x.id === myData[0].perks.styles[0].selections[0].perk
                    ).icon
                    data.perk2 = JSON.parse(perks).find(
                        (x) => x.id === myData[0].perks.styles[1].style
                    ).icon
                    data.spell1 = JSON.parse(spells).find(
                        (x) => x.key == myData[0].summoner1Id
                    ).id
                    data.spell2 = JSON.parse(spells).find(
                        (x) => x.key == myData[0].summoner2Id
                    ).id
                    data.item0 = myData[0].item0
                    data.item1 = myData[0].item1
                    data.item2 = myData[0].item2
                    data.item3 = myData[0].item3
                    data.item4 = myData[0].item4
                    data.item5 = myData[0].item5
                    data.item6 = myData[0].item6
                    data.champLevel = myData[0].champLevel
                    data.totalMinionsKilled =
                        myData[0].totalMinionsKilled +
                        myData[0].neutralMinionsKilled
                    data.kills = myData[0].kills
                    data.deaths = myData[0].deaths
                    data.assists = myData[0].assists
                    if (myData[0].deaths == 0) {
                        if (myData[0].kills + myData[0].assists == 0) {
                            data.kda = 0
                        } else {
                            data.kda = -1 // Infinity
                        }
                    } else {
                        data.kda =
                            (myData[0].kills + myData[0].assists) / myData[0].deaths
                    }

                    recentRecord.push(data)
                }
            }
            await redis.setEx(`${userId}/${page}`, 3600, JSON.stringify(recentRecord))
            res.status(200).json({
                recentRecord,
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            message: '최근전적 불러오기에 실패하였습니다.',
        })
    }
}

async function mypage(req, res) {
    const userId = res.locals.userId

    if (!userId) {
        return res.status(401).json({
            message: '로그인이 필요합니다.',
        })
    }

    let goodReview = []
    let badReview = []
    let registerPhone

    try {
        const currentUser = await User.findOne({ _id: userId })
        const review = await Review.findOne({ reviewedId: userId })
        if (currentUser.phoneNumber) {
            registerPhone = true
        } else {
            registerPhone = false
        }

        if (review) {
            res.status(200).json({
                lolNickname: currentUser.lolNickname,
                profileUrl: currentUser.profileUrl,
                tier: currentUser.tier,
                rank: currentUser.rank,
                leaguePoints: currentUser.leaguePoints,
                playStyle: currentUser.playStyle,
                position: currentUser.position,
                useVoice: currentUser.useVoice,
                goodReview: review.goodReview,
                badReview: review.badReview,
                registerPhone,
                agreeSMS: currentUser.agreeSMS,
            })
        } else {
            res.status(200).json({
                lolNickname: currentUser.lolNickname,
                profileUrl: currentUser.profileUrl,
                tier: currentUser.tier,
                rank: currentUser.rank,
                leaguePoints: currentUser.leaguePoints,
                playStyle: currentUser.playStyle,
                position: currentUser.position,
                useVoice: currentUser.useVoice,
                goodReview,
                badReview,
                registerPhone,
                agreeSMS: currentUser.agreeSMS,
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            message: '내정보 불러오기에 실패하였습니다.',
        })
    }
}

async function getPhoneNumber(req, res) {
    try {
        const userId = res.locals.userId

        const currentUser = await User.findOne({ _id: userId })

        const key = process.env.CRYPTO_KEY
        const decode = crypto.createDecipher('des', key)
        const decodeResult =
            decode.update(currentUser.phoneNumber, 'base64', 'utf8') +
            decode.final('utf8')
        // const user_phone_number = decodeResult.split('-').join('') // SMS를 수신할 전화번호

        res.json({
            phoneNumber: decodeResult,
        })
    } catch (error) {
        console.log(error)
        res.json({
            message: '핸드폰 번호 불러오기에 실패하였습니다.',
        })
    }
}

async function agreeSMS(req, res) {
    try {
        const userId = res.locals.userId
        const agreeSMS = req.body.agreeSMS

        await User.updateOne({ _id: userId }, { $set: { agreeSMS } })

        res.json({
            message: '문자 수신동의 변경에 성공하였습니다.',
        })
    } catch (error) {
        console.log(error)
        res.json({
            message: '문자 수신동의 변경에 실패하였습니다.',
        })
    }
}

async function sendSMS(req, res) {
    try {
        const userId = res.locals.userId
        const opponentId = req.body.opponentId

        const user = await User.findOne({ _id: userId })
        const opponent = await User.findOne({ _id: opponentId })

        if (opponent.agreeSMS === true) {
            const key = process.env.CRYPTO_KEY
            const decode = crypto.createDecipher('des', key)
            const decodeResult =
                decode.update(opponent.phoneNumber, 'base64', 'utf8') +
                decode.final('utf8')
            const date = Date.now().toString()

            // 환경 변수
            const sens_service_id = process.env.NCP_SENS_ID
            const sens_access_key = process.env.NCP_SENS_ACCESS
            const sens_secret_key = process.env.NCP_SENS_SECRET
            const sens_call_number = process.env.CALLER_NUMBER

            // url 관련 변수 선언
            const method = 'POST'
            const space = ' '
            const newLine = '\n'
            const url = `https://sens.apigw.ntruss.com/sms/v2/services/${sens_service_id}/messages`
            const url2 = `/sms/v2/services/${sens_service_id}/messages`

            // signature 작성 : crypto-js 모듈을 이용하여 암호화
            const hmac = CryptoJS.algo.HMAC.create(
                CryptoJS.algo.SHA256,
                sens_secret_key
            )
            hmac.update(method)
            hmac.update(space)
            hmac.update(url2)
            hmac.update(newLine)
            hmac.update(date)
            hmac.update(newLine)
            hmac.update(sens_access_key)
            const hash = hmac.finalize()
            const signature = hash.toString(CryptoJS.enc.Base64)

            const smsRes = await axios({
                method: method,
                url: url,
                headers: {
                    'Contenc-type': 'application/json; charset=utf-8',
                    'x-ncp-iam-access-key': sens_access_key,
                    'x-ncp-apigw-timestamp': date,
                    'x-ncp-apigw-signature-v2': signature,
                },
                data: {
                    type: 'SMS',
                    countryCode: '82',
                    from: sens_call_number,
                    content: `[듀오해듀오] ${opponent.lolNickname}님, ${user.lolNickname}님이 채팅을 보냈어요! \n https://duoduo.lol`,
                    messages: [{ to: `${decodeResult}` }],
                },
            })
            console.log('response', smsRes.data)

            res.json({
                message: '문자를 전송했습니다.',
            })
        } else {
            res.json({
                message: '수신동의 거부한 유저입니다.',
            })
        }
    } catch (error) {
        console.log(err)
        res.json({
            message: '문자 전송을 실패하였습니다.',
        })
    }
}

async function firstLogin(req, res) {
    const userId = res.locals.userId

    await User.updateOne({ _id: userId }, { $set: { firstLogin: false } })

    res.json({
        message: '첫 로그인 false 변경.',
    })
}

module.exports = {
    writeReview,
    userInfo,
    recentRecord,
    mypage,
    getPhoneNumber,
    agreeSMS,
    sendSMS,
    firstLogin,
}
