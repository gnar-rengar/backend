const axios = require('axios')
const User = require('../schemas/user')
const Review = require('../schemas/review')
require('dotenv').config()
const fs = require('fs')
const chapmions = fs.readFileSync('datas/champions.json', 'utf8')
const perks = fs.readFileSync('datas/perks.json', 'utf8')
const queueTypes = fs.readFileSync('datas/queueTypes.json', 'utf8')
const spells = fs.readFileSync('datas/spells.json', 'utf8')

const riotToken = process.env.riotTokenKey

async function writeReview(req, res) {
    const reviewedId = req.params.userId
    // const reviewerId = les.locals.userId
    const reviewerId = '62d2611ce44a2bec67355e05'

    // const reviewerCheck = await Review.findOne({ reviewedId, reviewerId })
    // if(reviewerCheck) {
    //     return res.send({
    //         success: false,
    //         message: "이미 리뷰를 작성한 유저입니다."
    //     })
    // }

    const goodReview = req.body.goodReview
    const badReview = req.body.badReview

    try {
        const reviewedCheck = await Review.findOne({ reviewedId })
        if (reviewedCheck) {
            await Review.updateOne({ reviewedId }, { $push: { reviewerId } })
            for (let i = 0; i < goodReview.length; i++) {
                const descriptionCheck = await Review.findOne({
                    reviewedId,
                    'goodReview.description': goodReview[i].description,
                })
                if (descriptionCheck) {
                    await Review.updateOne(
                        {
                            reviewedId,
                            'goodReview.description': goodReview[i].description,
                        },
                        { $inc: { 'goodReview.$.count': 1 } }
                    )
                } else {
                    await Review.updateOne(
                        { reviewedId },
                        {
                            $push: {
                                goodReview: {
                                    description: goodReview[i].description,
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
                    'badReview.description': badReview[i].description,
                })
                if (descriptionCheck) {
                    await Review.updateOne(
                        {
                            reviewedId,
                            'badReview.description': badReview[i].description,
                        },
                        { $inc: { 'badReview.$.count': 1 } }
                    )
                } else {
                    await Review.updateOne(
                        { reviewedId },
                        {
                            $push: {
                                badReview: {
                                    description: badReview[i].description,
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
                                description: goodReview[i].description,
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
                                description: badReview[i].description,
                                count: 1,
                            },
                        },
                    }
                )
            }
        }

        if (req.body.ban) {
            await User.updateOne(
                { _id: reviewerId },
                { $push: { banId: reviewedId } }
            )
        }

        res.status(200).send({
            success: true,
            message: '리뷰작성에 성공하였습니다.',
        })
    } catch (error) {
        console.log(error)
        res.send({
            success: false,
            message: '리뷰작성에 실패하였습니다.',
        })
    }
}

async function userInfo(req, res) {
    const userId = req.params.userId

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

        const mostChampion = await axios({
            method: 'GET',
            url: encodeURI(
                `https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summoner.data.id}`
            ),
            headers: {
                'X-Riot-Token': riotToken,
            },
        })

        const mostChampion1 = JSON.parse(chapmions).find(
            (x) => x.key == mostChampion.data[0].championId
        ).id
        const mostChampion2 = JSON.parse(chapmions).find(
            (x) => x.key == mostChampion.data[1].championId
        ).id
        const mostChampion3 = JSON.parse(chapmions).find(
            (x) => x.key == mostChampion.data[2].championId
        ).id

        const review = await Review.findOne({ reviewedId: userId })
        if(review) {
            res.status(200).send({
                success: true,
                lolNickname,
                profileUrl: currentUser.profileUrl,
                leaguePoints: currentUser.leaguePoints,
                playStyle: currentUser.playStyle,
                position: currentUser.position,
                useVoice: currentUser.useVoice,
                voiceChannel: currentUser.voiceChannel,
                communication: currentUser.communication,
                mostChampion1,
                mostChampion2,
                mostChampion3,
                goodReview: review.goodReview,
            })
        } else {
            res.status(200).send({
                success: true,
                lolNickname,
                profileUrl: currentUser.profileUrl,
                leaguePoints: currentUser.leaguePoints,
                playStyle: currentUser.playStyle,
                position: currentUser.position,
                useVoice: currentUser.useVoice,
                voiceChannel: currentUser.voiceChannel,
                communication: currentUser.communication,
                mostChampion1,
                mostChampion2,
                mostChampion3,
            })
        }
    } catch (error) {
        console.log(error)
        res.send({
            success: false,
            message: '유저정보 불러오기에 실패하였습니다.',
        })
    }
}

async function recentRecord(req, res) {
    const userId = req.params.userId

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

        const matchList = await axios({
            method: 'GET',
            url: encodeURI(
                `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${summoner.data.puuid}/ids?start=0&count=10`
            ),
            headers: {
                'X-Riot-Token': riotToken,
            },
        })

        let recentRecord = []

        for (let i = 0; i < matchList.data.length; i++) {
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
                (x) => x.summonerName == lolNickname
            )

            data.gameMode = match.data.info.gameMode
            data.gameType = match.data.info.gameType
            data.queueType = JSON.parse(queueTypes).find(
                (x) => x.queueId === match.data.info.queueId
            ).description
            data.gameStartTimestamp = match.data.info.gameStartTimestamp
            data.gameEndTimestamp = match.data.info.gameEndTimestamp
            data.win = myData[0].win
            data.championName = myData[0].championName
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
                myData[0].totalMinionsKilled + myData[0].neutralMinionsKilled
            data.kills = myData[0].kills
            data.deaths = myData[0].deaths
            data.assists = myData[0].assists
            data.kda = myData[0].challenges.kda

            recentRecord.push(data)
        }

        res.status(200).send({
            success: true,
            recentRecord,
        })
    } catch (error) {
        console.log(error)
        res.send({
            success: false,
            message: '최근전적 불러오기에 실패하였습니다.',
        })
    }
}

async function mypage(req, res) {
    // const userId = res.locals.userId
    const userId = '62d2611ce44a2bec67355e05'

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

        const review = await Review.findOne({ reviewedId: userId })
        if (review) {
            res.status(200).send({
                success: true,
                lolNickname,
                profileUrl: currentUser.profileUrl,
                leaguePoints: currentUser.leaguePoints,
                playStyle: currentUser.playStyle,
                position: currentUser.position,
                useVoice: currentUser.useVoice,
                goodReview: review.goodReview,
                badReview: review.badReview,
            })
        } else {
            res.status(200).send({
                success: true,
                lolNickname,
                profileUrl: currentUser.profileUrl,
                leaguePoints: currentUser.leaguePoints,
                playStyle: currentUser.playStyle,
                position: currentUser.position,
                useVoice: currentUser.useVoice,
            })
        }
    } catch (error) {
        console.log(error)
        res.send({
            success: false,
            message: '내정보 불러오기에 실패하였습니다.',
        })
    }
}

module.exports = {
    writeReview,
    userInfo,
    recentRecord,
    mypage,
}
