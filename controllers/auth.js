const passport = require('passport')
const jwt = require('jsonwebtoken')
const User = require('../schemas/user')
const RefreshToken = require('../schemas/refreshToken')
const ChatRoom = require('../schemas/chatroom')
const Improvement = require('../schemas/improvement')
require('dotenv').config()

const tokenExpireTime = process.env.VALID_ACCESS_TOKEN_TIME
const rtokenExpireTime = process.env.VALID_REFRESH_TOKEN_TIME

const COOKIE_OPTIONS = {
    domain: '.duoduo.lol',
    secure: true,
    httpOnly: true,
    sameSite: 'none',
}

const kakaoCallback = (req, res, next) => {
    passport.authenticate(
        'kakao',
        { failureRedirect: '/' },
        async (err, user, info) => {
            if (err) return next(err)
            const userId = user._id
            const token = jwt.sign({ userId: userId }, process.env.TOKENKEY, {
                expiresIn: tokenExpireTime,
            })
            let refreshToken = ''

            const currentUser = await User.findOne({ _id: userId })

            const dbRefresh = await RefreshToken.findOne({ userId })
            if (dbRefresh) {
                refreshToken = dbRefresh.refreshToken
            } else {
                refreshToken = jwt.sign(
                    { userId: userId },
                    process.env.TOKENKEY,
                    {
                        expiresIn: rtokenExpireTime,
                    }
                )

                await RefreshToken.create({ userId, refreshToken })
            }

            res.cookie('token', token, COOKIE_OPTIONS)
                .cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
                .status(200)
                .json({
                    isOnBoarded: currentUser.isOnBoarded,
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
            const userId = user._id
            const token = jwt.sign({ userId: userId }, process.env.TOKENKEY, {
                expiresIn: tokenExpireTime,
            })
            let refreshToken = ''

            const currentUser = await User.findOne({ _id: userId })

            const dbRefresh = await RefreshToken.findOne({ userId })
            if (dbRefresh) {
                refreshToken = dbRefresh.refreshToken
            } else {
                refreshToken = jwt.sign(
                    { userId: userId },
                    process.env.TOKENKEY,
                    {
                        expiresIn: rtokenExpireTime,
                    }
                )

                await RefreshToken.create({ userId, refreshToken })
            }

            res.cookie('token', token, COOKIE_OPTIONS)
                .cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
                .status(200)
                .json({
                    isOnBoarded: currentUser.isOnBoarded,
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
            const userId = user._id
            const token = jwt.sign({ userId: userId }, process.env.TOKENKEY, {
                expiresIn: tokenExpireTime,
            })
            let refreshToken = ''

            const currentUser = await User.findOne({ _id: userId })

            const dbRefresh = await RefreshToken.findOne({ userId })
            if (dbRefresh) {
                refreshToken = dbRefresh.refreshToken
            } else {
                refreshToken = jwt.sign(
                    { userId: userId },
                    process.env.TOKENKEY,
                    {
                        expiresIn: rtokenExpireTime,
                    }
                )

                await RefreshToken.create({ userId, refreshToken })
            }

            res.cookie('token', token, COOKIE_OPTIONS)
                .cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
                .status(200)
                .json({
                    isOnBoarded: currentUser.isOnBoarded,
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
            const userId = user._id
            const token = jwt.sign({ userId: userId }, process.env.TOKENKEY, {
                expiresIn: tokenExpireTime,
            })
            let refreshToken = ''

            const currentUser = await User.findOne({ _id: userId })

            const dbRefresh = await RefreshToken.findOne({ userId })
            if (dbRefresh) {
                refreshToken = dbRefresh.refreshToken
            } else {
                refreshToken = jwt.sign(
                    { userId: userId },
                    process.env.TOKENKEY,
                    {
                        expiresIn: rtokenExpireTime,
                    }
                )

                await RefreshToken.create({ userId, refreshToken })
            }

            res.cookie('token', token, COOKIE_OPTIONS)
                .cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
                .status(200)
                .json({
                    isOnBoarded: currentUser.isOnBoarded,
                })
        }
    )(req, res)
}

async function checkMyInfo(req, res) {
    const userId = res.locals.userId
    const lolNickname = res.locals.lolNickname
    const profileUrl = res.locals.profileUrl
    const isOnBoarded = res.locals.isOnBoarded
    const playStyle = res.locals.playStyle

    res.status(200).json({
        userId,
        lolNickname,
        profileUrl,
        isOnBoarded,
        playStyle,
    })
}

async function logout(req, res) {
    const userId = res.locals.userId

    res.clearCookie('token', COOKIE_OPTIONS)
        .clearCookie('refreshToken', COOKIE_OPTIONS)
        .status(200)
        .json({
            message: '로그아웃 되었습니다.',
        })
}

async function deleteUser(req, res) {
    const userId = res.locals.userId
    const improvement = req.body.reason

    try {
        if (userId) {
            if (improvement) {
                await Improvement.create({ context: improvement })
            }

            await User.deleteOne({ _id: userId })
            await RefreshToken.deleteOne({ userId })
            await ChatRoom.deleteMany({ userId: { $in: userId } })
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
