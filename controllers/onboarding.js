const axios = require('axios')
const User = require('../schemas/user')
const multer = require('../middlewares/multers/multer')
require('dotenv').config()

const riotToken = process.env.riotTokenKey

async function checkNick(req, res) {
    let lolNickname = ''
    if (req.query.lolNickname) {
        lolNickname = req.query.lolNickname
    }

    const exUser = await User.findOne({ lolNickname })

    if (exUser) {
        return res.send({
            success: false,
            message: '이미 등록된 계정입니다.',
        })
    }

    try {
        const summoner = await axios({
            method: 'GET',
            url: encodeURI(
                `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${lolNickname}`
            ),
            headers: {
                'X-Riot-Token': riotToken,
            },
        })
        res.status(200).send({
            success: true,
            profileUrl: `http://ddragon.leagueoflegends.com/cdn/12.11.1/img/profileicon/${summoner.data.profileIconId}.png`,
            message: '계정이 확인되었습니다.',
        })
    } catch (error) {
        console.log(error)
        res.status(404).send({
            success: false,
            message: '존재하지 않는 계정입니다.',
        })
    }
}

async function updateOnboarding(req, res) {
    // const userId = les.locals.userId
    const userId = '62bfd94f10fe87a93848aa59'

    const data = {
        profileUrl: req.body.profileUrl,
        nickname: req.body.nickname,
        lolNickname: req.body.lolNickname,
        position: req.body.position,
        voice: req.body.voice,
        voiceChannel: req.body.voiceChannel,
        communication: req.body.communication,
        playStyle: req.body.playStyle,
    }

    try {
        if (req.file) {
            const currentUser = await User.findOne({ _id: userId })

            if (currentUser.profileUrl) {
                if (
                    currentUser.profileUrl.split('/')[2] !==
                    'ddragon.leagueoflegends.com'
                )
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
        console.log(error)
        res.send({
            success: false,
            message: '추가정보 등록에 실패하였습니다.',
        })
    }
}

async function getOnboarding(req, res) {
    // const userId = les.locals.userId
    const userId = '62bfd94f10fe87a93848aa59'

    try {
        const currentUser = await User.findOne({ _id: userId })

        res.status(200).send({
            success: true,
            profileUrl: currentUser.profileUrl,
            nickname: currentUser.nickname,
            lolNickname: currentUser.lolNickname,
            position: currentUser.position,
            voice: currentUser.voice,
            voiceChannel: currentUser.voiceChannel,
            communication: currentUser.communication,
            playStyle: currentUser.playStyle,
        })
    } catch (error) {
        console.log(error)
        res.send({
            success: false,
            message: '온보딩 불러오기에 실패하였습니다.',
        })
    }
}

module.exports = {
    checkNick,
    updateOnboarding,
    getOnboarding,
}
