const passport = require('passport')
const jwt = require('jsonwebtoken')
const User = require('../schemas/user')
const RefreshToken = require('../schemas/refreshToken')
const ChatRoom = require('../schemas/chatroom')
const Improvement = require('../schemas/improvement')
const Certification = require('../schemas/certification')
require('dotenv').config()
const CryptoJS = require('crypto-js')
const crypto = require('crypto')
const axios = require('axios')

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
                    firstLogin: currentUser.firstLogin,
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
                    firstLogin: currentUser.firstLogin,
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
                    firstLogin: currentUser.firstLogin,
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
                    firstLogin: currentUser.firstLogin,
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

async function sendVerificationSMS(req, res) {
    try {
        // const userId = res.locals.userId
        const userId = '62f63bd76e6b6341b60cee01'
        const phoneNumber = req.body.phoneNumber

        // const user_phone_number = phoneNumber.split('-').join('') // SMS를 수신할 전화번호
        const verificationCode =
            Math.floor(Math.random() * (999999 - 100000)) + 100000 // 인증 코드 (6자리 숫자)
        const date = Date.now().toString() // 날짜 string

        // 환경 변수
        const sens_service_id = process.env.NCP_SENS_ID
        const sens_access_key = process.env.NCP_SENS_ACCESS
        const sens_secret_key = process.env.NCP_SENS_SECRET
        const sens_call_number = process.env.CALLER_NUMBER

        // url 관련 변수 선언
        const method = 'POST'
        const space = ' '
        const newLine = '\n'
        const url = `https://sens.apigw.ntruss.com/sms/v2/services/${sens_service_id}/messages`
        const url2 = `/sms/v2/services/${sens_service_id}/messages`

        // signature 작성 : crypto-js 모듈을 이용하여 암호화
        const hmac = CryptoJS.algo.HMAC.create(
            CryptoJS.algo.SHA256,
            sens_secret_key
        )
        hmac.update(method)
        hmac.update(space)
        hmac.update(url2)
        hmac.update(newLine)
        hmac.update(date)
        hmac.update(newLine)
        hmac.update(sens_access_key)
        const hash = hmac.finalize()
        const signature = hash.toString(CryptoJS.enc.Base64)

        // sens 서버로 요청 전송
        const smsRes = await axios({
            method: method,
            url: url,
            headers: {
                'Contenc-type': 'application/json; charset=utf-8',
                'x-ncp-iam-access-key': sens_access_key,
                'x-ncp-apigw-timestamp': date,
                'x-ncp-apigw-signature-v2': signature,
            },
            data: {
                type: 'SMS',
                countryCode: '82',
                from: sens_call_number,
                content: `듀오해듀오 인증번호는 [${verificationCode}] 입니다.`,
                messages: [{ to: `${phoneNumber}` }],
            },
        })
        console.log('response', smsRes.data)

        const certification = await Certification.findOne({ userId })

        if (certification) {
            await Certification.deleteMany({ userId })
            await Certification.create({ userId, verifyCode: verificationCode })
        } else {
            await Certification.create({ userId, verifyCode: verificationCode })
        }

        return res.status(200).json({
            message: '인증번호를 전송하였습니다.',
        })
    } catch (err) {
        console.log(err)
        res.json({
            message: '인증번호 전송을 실패하였습니다.',
        })
    }
}

async function verifyCode(req, res) {
    // const userId = res.locals.userId
    const userId = '62f63bd76e6b6341b60cee01'
    const { phoneNumber, code } = req.body

    const dbCode = await Certification.findOne({ userId })

    if (code == dbCode.verifyCode) {
        await Certification.deleteMany({ userId })

        const key = process.env.CRYPTO_KEY
        const encrypt = crypto.createCipher('des', key)
        const encryptResult =
            encrypt.update(phoneNumber, 'utf8', 'base64') +
            encrypt.final('base64')

        await User.updateOne(
            { _id: userId },
            { $set: { phoneNumber: encryptResult, agreeSMS: true } }
        )

        return res.status(200).json({ message: '핸드폰 인증 완료.' })
    } else {
        return res.status(400).json({ message: '인증번호가 다릅니다.' })
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
    sendVerificationSMS,
    verifyCode,
}
