const passport = require('passport')
const jwt = require('jsonwebtoken')
const User = require('../schemas/user')
const RefreshToken = require('../schemas/refreshToken')
require('dotenv').config()

const tokenExpireTime = process.env.VALID_ACCESS_TOKEN_TIME
const rtokenExpireTime = process.env.VALID_REFRESH_TOKEN_TIME

const COOKIE_OPTIONS = {
    domain: '.kakao.com',
    httpOnly: true,
    sameSite: 'none',
    secure: true
}

const kakaoCallback = (req, res) => {
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

            res.cookie('token', token, COOKIE_OPTIONS)
            res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
            res.status(200).json({
                tokenExpireTime,
                rtokenExpireTime,
                userId,
                lolNickname: currentUser.lolNickname,
                profileUrl: currentUser.profileUrl,
            })
        }
    )(req, res)
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

            res.cookie('token', token, COOKIE_OPTIONS)
            res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
            res.status(200).json({
                tokenExpireTime,
                rtokenExpireTime,
                userId,
                lolNickname: currentUser.lolNickname,
                profileUrl: currentUser.profileUrl,
            })
        }
    )(req, res)
}

const naverCallback = (req, res) => {
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

            res.cookie('token', token, COOKIE_OPTIONS)
            res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
            res.status(200).json({
                tokenExpireTime,
                rtokenExpireTime,
                userId,
                lolNickname: currentUser.lolNickname,
                profileUrl: currentUser.profileUrl,
            })
        }
    )(req, res)
}

const discordCallback = (req, res) => {
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

            res.cookie('token', token, COOKIE_OPTIONS)
            res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
            res.status(200).json({
                tokenExpireTime,
                rtokenExpireTime,
                userId,
                lolNickname: currentUser.lolNickname,
                profileUrl: currentUser.profileUrl,
            })
        }
    )(req, res)
}

async function checkMyInfo(req, res) {
    const userId = res.locals.userId
    const lolNickname = res.locals.lolNickname
    const profileUrl = res.locals.profileUrl
    const isOnBoarded = res.locals.isOnBoarded

    if (!req.cookies.token) {
        return res.status(100)
    }

    res.status(200).json({
        userId,
        lolNickname,
        profileUrl,
        isOnBoarded
    })

}

async function logout(req, res) {
    const userId = res.locals.userId
    const agent = req.headers['user-agent']

    await RefreshToken.deleteOne({ userId, agent })

    res.clearCookie('token', COOKIE_OPTIONS)
        .clearCookie('refreshToken', COOKIE_OPTIONS)
        .status(200)
        .send({
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
            res.clearCookie('token', COOKIE_OPTIONS)
                .clearCookie('refreshToken', COOKIE_OPTIONS)
                .status(200)
                .json({
                    message: '회원탈퇴에 성공하였습니다.',
                })
        } else {
            res.json({
                message: '즐',
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            message: '회원탈퇴에 실패하였습니다.',
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
