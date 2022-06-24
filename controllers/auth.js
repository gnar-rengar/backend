const passport = require('passport')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const User = require('../schemas/user')
require('dotenv').config()

const kakaoCallback = (req, res, next) => {
    passport.authenticate(
        'kakao',
        { failureRedirect: '/' },
        async (err, user, info) => {
            if (err) return next(err)
            const agent = req.headers['user-agent']
            const { userId } = user
            let firstLogin = false
            const currentUser = await userService.getUser(userId)
            const token = jwt.sign({ userId: userId }, process.env.TOKENKEY, {
                expiresIn: process.env.VALID_ACCESS_TOKEN_TIME,
            })
            const refreshToken = jwt.sign(
                { userId: userId },
                process.env.TOKENKEY,
                { expiresIn: process.env.VALID_REFRESH_TOKEN_TIME }
            )

            const key = userId + agent
            await userService.setRedis(key, refreshToken)

            if (!currentUser.likeLocation) firstLogin = true

            return res.json({
                succcss: true,
                token,
                refreshToken,
                userId,
                nickname: currentUser.nickname,
                profileUrl: currentUser.profileUrl,
                firstLogin,
                agreeSMS: currentUser.agreeSMS,
            })
        }
    )(req, res, next)
}

const googleCallback = (req, res) => {
    
}

const naverCallback = (req, res, next) => {
    passport.authenticate(
        'naver',
        { failureRedirect: '/' },
        async (err, user, info) => {
            if (err) return next(err)
            const agent = req.headers['user-agent']
            const { userId } = user
            let firstLogin = false
            const currentUser = await userService.getUser(userId)
            const token = jwt.sign({ userId: userId }, process.env.TOKENKEY, {
                expiresIn: process.env.VALID_ACCESS_TOKEN_TIME,
            })
            const refreshToken = jwt.sign(
                { userId: userId },
                process.env.TOKENKEY,
                { expiresIn: process.env.VALID_REFRESH_TOKEN_TIME }
            )

            const key = userId + agent
            await userService.setRedis(key, refreshToken)

            if (!currentUser.likeLocation) firstLogin = true

            return res.json({
                succcss: true,
                token,
                refreshToken,
                userId,
                nickname: currentUser.nickname,
                profileUrl: currentUser.profileUrl,
                firstLogin,
                agreeSMS: currentUser.agreeSMS,
            })
        }
    )(req, res, next)
}

async function checkMyInfo(req, res) {
    const userId = res.locals.userId
    const nickname = res.locals.nickname
    const profileUrl = res.locals.profileUrl
    const firstLogin = res.locals.firstLogin
    const agreeSMS = res.locals.agreeSMS

    res.send({
        success: true,
        userId,
        nickname,
        profileUrl,
        firstLogin,
        agreeSMS,
    })
}

async function checkNick(req, res) {
    const { lolNickname } = req.body

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
            message: "계정이 확인되었습니다."
        })
    } catch (error) {
        res.status(404).send({
            success: false,
            message: "존재하지 않는 계정입니다."
        })
    }
}

async function logout(req, res) {
    const userId = res.locals.userId
    const agent = req.headers['user-agent']
    const key = userId + agent

    await userService.delRedis(key)

    res.send({
        success: true,
        message: '로그아웃 되었습니다.',
    })
}

async function deleteUser(req, res) {
    const userId = res.locals.userId
    const agent = req.headers['user-agent']
    const key = userId + agent

    try {
        await userService.delRedis(key)
        await userService.deleteUser(userId)
        res.status(200).send({
            success: true,
            message: '회원탈퇴에 성공하였습니다.',
        })
    } catch (error) {
        return next({
            message: '회원탈퇴에 실패하였습니다.',
            stack: error,
        })
    }
}

module.exports = {
    kakaoCallback,
    googleCallback,
    naverCallback,
    checkMyInfo,
    checkNick,
    logout,
    deleteUser,
}
