const passport = require('passport')
const jwt = require('jsonwebtoken')
const User = require('../schemas/user')
const RefreshToken = require('../schemas/refreshToken')
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
            const token = jwt.sign({ userId: userId }, process.env.TOKENKEY, {
                expiresIn: tokenExpireTime,
            })
            const refreshToken = jwt.sign(
                { userId: userId },
                process.env.TOKENKEY,
                {
                    expiresIn: rtokenExpireTime,
                }
            )

            await RefreshToken.create({ userId, agent, refreshToken })

            return res.json({
                succcss: true,
                token,
                tokenExpireTime,
                refreshToken,
                rtokenExpireTime,
                userId,
                lolNickname: currentUser.lolNickname,
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
            const token = jwt.sign({ userId: userId }, process.env.TOKENKEY, {
                expiresIn: tokenExpireTime,
            })
            const refreshToken = jwt.sign(
                { userId: userId },
                process.env.TOKENKEY,
                {
                    expiresIn: rtokenExpireTime,
                }
            )

            await RefreshToken.create({ userId, agent, refreshToken })

            return res.json({
                succcss: true,
                token,
                tokenExpireTime,
                refreshToken,
                rtokenExpireTime,
                userId,
                lolNickname: currentUser.lolNickname,
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
            const token = jwt.sign({ userId: userId }, process.env.TOKENKEY, {
                expiresIn: tokenExpireTime,
            })
            const refreshToken = jwt.sign(
                { userId: userId },
                process.env.TOKENKEY,
                {
                    expiresIn: rtokenExpireTime,
                }
            )

            await RefreshToken.create({ userId, agent, refreshToken })

            return res.json({
                succcss: true,
                token,
                tokenExpireTime,
                refreshToken,
                rtokenExpireTime,
                userId,
                lolNickname: currentUser.lolNickname,
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
            const token = jwt.sign({ userId: userId }, process.env.TOKENKEY, {
                expiresIn: tokenExpireTime,
            })
            const refreshToken = jwt.sign(
                { userId: userId },
                process.env.TOKENKEY,
                {
                    expiresIn: rtokenExpireTime,
                }
            )

            await RefreshToken.create({ userId, agent, refreshToken })

            return res.json({
                succcss: true,
                token,
                tokenExpireTime,
                refreshToken,
                rtokenExpireTime,
                userId,
                lolNickname: currentUser.lolNickname,
                profileUrl: currentUser.profileUrl,
            })
        }
    )(req, res, next)
}

async function checkMyInfo(req, res) {
    const userId = res.locals.userId
    const lolNickname = res.locals.lolNickname
    const profileUrl = res.locals.profileUrl

    res.send({
        success: true,
        userId,
        nickname,
        lolNickname,
        profileUrl,
    })
}

async function logout(req, res) {
    const userId = res.locals.userId
    const agent = req.headers['user-agent']

    await RefreshToken.deleteOne({ userId, agent })

    res.send({
        success: true,
        message: '로그아웃 되었습니다.',
    })
}

async function deleteUser(req, res) {
    const userId = res.locals.userId
    const agent = req.headers['user-agent']

    try {
        if (userId) {
            await RefreshToken.deleteOne({ userId, agent })
            await User.deleteOne({ _id: userId })
            res.status(200).send({
                success: true,
                message: '회원탈퇴에 성공하였습니다.',
            })
        } else {
            res.send({
                message: '즐',
            })
        }
    } catch (error) {
        console.log(error)
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
