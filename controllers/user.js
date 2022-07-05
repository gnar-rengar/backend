const axios = require('axios')
const User = require('../schemas/user')
const Review = require('../schemas/review')
const multer = require('../middlewares/multers/multer')
require('dotenv').config()
const fs = require('fs')
const queueTypes = fs.readFileSync('datas/queueTypes.json', 'utf8')
const spells = fs.readFileSync('datas/spells.json', 'utf8')

const riotToken = process.env.riotTokenKey

async function checkNick(req, res) {
    let lolNickname = ''
    if(req.query.lolNickname) {
        lolNickname = req.query.lolNickname
    }

    const exUser = await User.findOne( { lolNickname } )

    if(exUser) {
        return res.send({
            success: false,
            message: "이미 등록된 계정입니다."
        })
    }

    try{
        const summoner = await axios({
            method: 'GET',
            url: encodeURI(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${lolNickname}`),
            headers: {
                "X-Riot-Token": riotToken
            },
        })
        res.status(200).send({
            success: true,
            profileUrl: `http://ddragon.leagueoflegends.com/cdn/12.11.1/img/profileicon/${summoner.data.profileIconId}.png`,
            message: "계정이 확인되었습니다."
        })
    } catch (error) {
        res.status(404).send({
            success: false,
            message: "존재하지 않는 계정입니다."
        })
    }
}

async function updateOnboarding(req, res) {
    // const userId = les.locals.userId
    const userId = "62bfd94f10fe87a93848aa59"

    const data = {
        profileUrl: req.body.profileUrl,
        nickname: req.body.nickname,
        lolNickname : req.body.lolNickname,
        playStyle: req.body.playStyle,
        position: req.body.position,
        voice: req.body.voice,
        voiceChannel: req.body.voiceChannel,
        communication: req.body.communication
    }

    try {
        if (req.file) {
            const currentUser = await User.findOne( { _id: userId } )

            if (currentUser.profileUrl) {
                if (currentUser.profileUrl.split('/')[2] !== 'ddragon.leagueoflegends.com')
                    multer.deleteImage(currentUser.profileUrl)
            }
            data.profileUrl = req.file.location
        }

        await User.updateOne({ _id: userId }, { $set: data })
        res.status(200).send({
            success: true,
            message: '추가정보 등록에 성공하였습니다.',
        })
    } catch (error) {
        res.send({
            success: false,
            message: "추가정보 등록에 실패하였습니다."
        })
    }
}

async function getOnboarding(req, res) {
    // const userId = les.locals.userId
    const userId = "62bfd94f10fe87a93848aa59"

    try {
        const currentUser = await User.findOne({ _id: userId })

        res.status(200).send({
            success: true,
            profileUrl: currentUser.profileUrl,
            nickname: currentUser.nickname,
            lolNickname: currentUser.lolNickname,
            playStyle: currentUser.playStyle,
            position: currentUser.position,
            voice: currentUser.voice,
            voiceChannel: currentUser.voiceChannel,
            communication: currentUser.communication
        })

    } catch (error) {
        res.send({
            success: false,
            message: "온보딩 불러오기에 실패하였습니다."
        })
    }
}

async function getReview(req, res) {
    const reviewedId = req.params.userId
}

async function writeReview(req, res) {
    const reviewedId = req.params.userId
    // const reviewerId = les.locals.userId
    const reviewerId = "62bfd98e10fe87a93848aa5d"

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
                const descriptionCheck = await Review.findOne({ reviewedId, 'goodReview.description': goodReview[i].description })
                if (descriptionCheck) {
                    await Review.updateOne({ reviewedId, 'goodReview.description': goodReview[i].description }, { $inc: { 'goodReview.$.count': 1 } })
                } else {
                    await Review.updateOne({ reviewedId }, { $push: { goodReview: { description: goodReview[i].description, count: 1 } } })
                }
            }
            for (let i = 0; i < badReview.length; i++) {
                const descriptionCheck = await Review.findOne({ reviewedId, 'badReview.description': badReview[i].description })
                if (descriptionCheck) {
                    await Review.updateOne({ reviewedId, 'badReview.description': badReview[i].description }, { $inc: { 'badReview.$.count': 1 } })
                } else {
                    await Review.updateOne({ reviewedId }, { $push: { badReview: { description: badReview[i].description, count: 1 } } })
                }
            }
        } else {
            await Review.create({ reviewedId, reviewerId })
            for (let i = 0; i < goodReview.length; i++) {
                await Review.updateOne({ reviewedId }, { $push: { goodReview: { description: goodReview[i].description, count: 1 } } })
            }
            for (let i = 0; i < badReview.length; i++) {
                await Review.updateOne({ reviewedId }, { $push: { badReview: { description: badReview[i].description, count: 1 } } })
            }
        }

        if (req.body.ban) {
            await User.updateOne({ _id: reviewerId }, { $push: { banId: reviewedId }})
        }

        res.status(200).send({
            success: true,
            message: '리뷰작성에 성공하였습니다.',
        })
    } catch (error) {
        res.send({
            success: false,
            message: "리뷰작성에 실패하였습니다."
        })
    }
}

async function userInfo (req, res) {

}

async function recentRecord (req, res) {
    const userId = req.params.userId

    const currentUser = await User.findOne({ _id: userId })
    // const lolNickname = currentUser.lolNickname
    const lolNickname = '배죤나고픔'

    const summoner = await axios({
        method: 'GET',
        url: encodeURI(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${lolNickname}`),
        headers: {
            "X-Riot-Token": riotToken
        },
    })

    const matchList = await axios({
        method: 'GET',
        url: encodeURI(`https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${summoner.data.puuid}/ids?start=0&count=10`),
        headers: {
            "X-Riot-Token": riotToken
        },
    })
    
    let recentRecord = []

    for(let i = 0; i < matchList.data.length; i++) {

        let data = {}

        const match = await axios({
            method: 'GET',
            url: encodeURI(`https://asia.api.riotgames.com/lol/match/v5/matches/${matchList.data[i]}`),
            headers: {
                "X-Riot-Token": riotToken
            },
        })

        const myData = match.data.info.participants.filter(x => x.summonerName == lolNickname)

        data.gameMode = match.data.info.gameMode
        data.gameType = match.data.info.gameType
        data.queueType = JSON.parse(queueTypes).find(x => x.queueId === match.data.info.queueId).description
        data.gameStartTimestamp = match.data.info.gameStartTimestamp
        data.gameEndTimestamp = match.data.info.gameEndTimestamp 
        data.win = myData[0].win
        data.championName = myData[0].championName
        data.spell1 = JSON.parse(spells).find(x => x.key === myData[0].summoner1Id).id
        data.spell2 = JSON.parse(spells).find(x => x.key === myData[0].summoner2Id).id
        data.item0 =  myData[0].item0
        data.item1 =  myData[0].item1
        data.item2 =  myData[0].item2
        data.item3 =  myData[0].item3
        data.item4 =  myData[0].item4
        data.item5 =  myData[0].item5
        data.item6 =  myData[0].item6
        data.champLevel = myData[0].champLevel
        data.totalMinionsKilled = myData[0].totalMinionsKilled + myData[0].neutralMinionsKilled
        data.kills = myData[0].kills
        data.deaths = myData[0].deaths
        data.assists = myData[0].assists
        data.kda = myData[0].challenges.kda

        recentRecord.push(data)
    }

    res.send({
        success: true,
        recentRecord
    })
}

module.exports = {
    checkNick,
    updateOnboarding,
    getOnboarding,
    getReview,
    writeReview,
    userInfo,
    recentRecord,
}
