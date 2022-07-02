const axios = require('axios')
const User = require('../schemas/user')
const Review = require('../schemas/review')
const multer = require('../middlewares/multers/multer')
require('dotenv').config()

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

    const riotToken = process.env.riotTokenKey

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
    const userId = "62bc79d90970421823066d44"

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
    const userId = "62bc79d90970421823066d44"

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
    const reviewerId = "62bc79d90970421823066d44"

    // const reviewerCheck = await Review.findOne({ reviewedId, reviewerId })
    // if(reviewerCheck) {
    //     return res.send({
    //         success: false,
    //         message: "이미 리뷰를 작성한 유저입니다."
    //     })
    // }

    const goodReview = req.body.goodReview
    const badReview = req.body.badReview

    const reviewedCheck = await Review.findOne({ reviewedId })
    if(reviewedCheck) {
        await Review.updateOne({ reviewedId }, { $push: { reviewerId} } )
        for(let i = 0; i < goodReview.length; i++) {

        }
    } else {
        await Review.create({ reviewedId, reviewerId })
        for(let i = 0; i < goodReview.length; i++) {
            await Review.updateOne({ reviewedId }, { $push: { goodReview : { description: goodReview[i].description, count: 1 } } })
        }
        for(let i = 0; i < badReview.length; i++) {
            await Review.updateOne({ reviewedId }, { $push: { badReview : { description: badReview[i].description, count: 1 } } })
        }
    }

    res.send({success:true})
}


module.exports = {
    checkNick,
    updateOnboarding,
    getOnboarding,
    getReview,
    writeReview
}
