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

    // const exUser = await User.findOne({ lolNickname })

    // if (exUser) {
    //     return res.status(409).send({
    //         success: false,
    //         message: '이미 등록된 계정입니다.',
    //     })
    // }

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
            profileUrl: `http://ddragon.leagueoflegends.com/cdn/12.11.1/img/profileicon/${summoner.data.profileIconId}.png`,
            message: '계정이 확인되었습니다.',
        })
    } catch (error) {
        console.log(error)
        res.status(404).send({
            message: '존재하지 않는 계정입니다.',
        })
    }
}

async function updateOnboarding(req, res) {
    const userId = res.locals.userId
    const lolNickname = req.body.lolNickname

    const data = {
        profileUrl: req.body.profileUrl,
        lolNickname: req.body.lolNickname,
        position: req.body.position,
        useVoice: req.body.useVoice,
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
        const tier = soloPoint.tier
        const rank = soloPoint.rank
        const leaguePoints = soloPoint.leaguePoints

        data.tier = tier
        data.rank = rank
        data.leaguePoints = leaguePoints

        await User.updateOne({ _id: userId }, { $set: data })
        res.status(200).json({
            message: '추가정보 등록에 성공하였습니다.',
        })
    } catch (error) {
        console.log(error)
        res.json({
            message: '추가정보 등록에 실패하였습니다.',
        })
    }
}

async function getOnboarding(req, res) {
    const userId = res.locals.userId

    try {
        const currentUser = await User.findOne({ _id: userId })

        res.status(200).json({
            success: true,
            profileUrl: currentUser.profileUrl,
            lolNickname: currentUser.lolNickname,
            position: currentUser.position,
            useVoice: currentUser.useVoice,
            voiceChannel: currentUser.voiceChannel,
            communication: currentUser.communication,
            playStyle: currentUser.playStyle,
        })
    } catch (error) {
        console.log(error)
        res.json({
            message: '온보딩 불러오기에 실패하였습니다.',
        })
    }
}

module.exports = {
    checkNick,
    updateOnboarding,
    getOnboarding,
}
