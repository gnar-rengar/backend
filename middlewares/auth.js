const jwt = require('jsonwebtoken')
const User = require('../schemas/user')
const RefreshToken = require('../schemas/refreshToken')
require('dotenv').config()

const COOKIE_OPTIONS = {
    domain: '.kakao.com',
    httpOnly: true,
    sameSite: 'none',
    secure: true
}

module.exports = {
    async checkTokens(req, res, next) {
        try {
            // case 1 token 유효
            if (!req.cookies.token) {
                return next()
            }

            const token = req.cookies.token
            const user = jwt.verify(token, process.env.TOKENKEY)
            const currentUser = await User.findOne({ _id: user.userId })

            res.locals.userId = currentUser._id
            res.locals.lolNickname = currentUser.lolNickname
            res.locals.profileUrl = currentUser.profileUrl
            res.locals.isOnBoarded = currentUser.isOnBoarded

            next()
        } catch (error) {
            try {
                if (error.name === 'TokenExpiredError') {
                    // case 2 token 만료, refreshToken 유효
                    const refreshToken = req.cookies.refreshToken
                    const user = jwt.verify(refreshToken, process.env.TOKENKEY)
                    const agent = req.headers['user-agent']
                    const dbRefresh = await RefreshToken.findOne({
                        userId: user.userId,
                        agent,
                    })

                    if (refreshToken !== dbRefresh.refreshToken)
                        return res.status(401).json({
                            message: '다시 로그인해주세요.',
                            reason: 'database에 저장된 refreshToken과 다릅니다.',
                        })

                    const newToken = jwt.sign(
                        { userId: user.userId },
                        process.env.TOKENKEY,
                        { expiresIn: process.env.VALID_ACCESS_TOKEN_TIME }
                    )

                    return res
                        .cookie('token', newToken, COOKIE_OPTIONS)
                        .status(401)
                        .json({
                            message: 'new Token 발급',
                            reason: 'token 만료',
                        })
                } else {
                    return res.status(401).json({
                        message: '다시 로그인해주세요.',
                        reason: 'token에 문제가 있습니다.',
                    })
                }
            } catch (error) {
                if (error.name === 'TokenExpiredError') {
                    return res.status(401).json({
                        message: '다시 로그인해주세요.',
                        reason: 'refreshToken이 만료되었습니다.',
                    })
                } else {
                    return res.status(401).json({
                        message: '다시 로그인해주세요.',
                        reason: 'refreshToken에 문제가 있습니다.',
                    })
                }
            }
        }
    },
}
