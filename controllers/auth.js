const passport = require('passport')
const jwt = require('jsonwebtoken')
const User = require('../schemas/user')
require('dotenv').config()

const tokenExpireTime = process.env.VALID_ACCESS_TOKEN_TIME
const rtokenExpireTime = process.env.VALID_REFRESH_TOKEN_TIME

const kakaoCallback = (req, res, next) => {
    passport.authenticate(
        'kakao',
        { failureRedirect: '/' },
        async (err, user, info) => {
            if (err) return next(err)
            const agent = req.headers['user-agent']
            const userId = user._id
            const currentUser = await User.findOne({ _id: userId })
            const token = jwt.sign(
                { userId: userId },
                process.env.TOKENKEY,
                { expiresIn: tokenExpireTime }
            )
            const refreshToken = jwt.sign(
                { userId: userId },
                process.env.TOKENKEY,
                { expiresIn: rtokenExpireTime }
            )

            const key = userId + agent

            return res.json({
                succcss: true,
                token,
                tokenExpireTime,
                refreshToken,
                rtokenExpireTime,
                userId,
                nickname: currentUser.nickname,
                profileUrl: currentUser.profileUrl,
            })
        }
    )(req, res, next)
}

const googleCallback = (req, res) => {
    passport.authenticate(
        'google',
        { failureRedirect: '/' },
        async (err, user, info) => {
            if (err) return next(err)
            const agent = req.headers['user-agent']
            const userId = user._id
            const currentUser = await User.findOne({ _id: userId })
            const token = jwt.sign(
                { userId: userId },
                process.env.TOKENKEY,
                { expiresIn: tokenExpireTime }
            )
            const refreshToken = jwt.sign(
                { userId: userId },
                process.env.TOKENKEY,
                { expiresIn: rtokenExpireTime }
            )

            const key = userId + agent

            return res.json({
                succcss: true,
                token,
                tokenExpireTime,
                refreshToken,
                rtokenExpireTime,
                userId,
                nickname: currentUser.nickname,
                profileUrl: currentUser.profileUrl,
            })
        }
    )(req, res, next)
}

const naverCallback = (req, res, next) => {
    passport.authenticate(
        'naver',
        { failureRedirect: '/' },
        async (err, user, info) => {
            if (err) return next(err)
            const agent = req.headers['user-agent']
            const userId = user._id
            const currentUser = await User.findOne({ _id: userId })
            const token = jwt.sign(
                { userId: userId },
                process.env.TOKENKEY,
                { expiresIn: tokenExpireTime }
            )
            const refreshToken = jwt.sign(
                { userId: userId },
                process.env.TOKENKEY,
                { expiresIn: rtokenExpireTime }
            )

            const key = userId + agent

            return res.json({
                succcss: true,
                token,
                tokenExpireTime,
                refreshToken,
                rtokenExpireTime,
                userId,
                nickname: currentUser.nickname,
                profileUrl: currentUser.profileUrl,
            })
        }
    )(req, res, next)
}

const discordCallback = (req, res, next) => {
    passport.authenticate(
        'discord',
        { failureRedirect: '/' },
        async (err, user, info) => {
            if (err) return next(err)
            const agent = req.headers['user-agent']
            const userId = user._id
            const currentUser = await User.findOne({ _id: userId })
            const token = jwt.sign(
                { userId: userId },
                process.env.TOKENKEY,
                { expiresIn: tokenExpireTime }
            )
            const refreshToken = jwt.sign(
                { userId: userId },
                process.env.TOKENKEY,
                { expiresIn: rtokenExpireTime }
            )

            const key = userId + agent

            return res.json({
                succcss: true,
                token,
                tokenExpireTime,
                refreshToken,
                rtokenExpireTime,
                userId,
                nickname: currentUser.nickname,
                profileUrl: currentUser.profileUrl,
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
    discordCallback,
    checkMyInfo,
    logout,
    deleteUser,
}
