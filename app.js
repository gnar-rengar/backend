const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
app.use(cookieParser())
const cors = require('cors')
const Router = require('./routes')
const passport = require('passport')
const session = require('express-session')

const passportConfig = require('./passport')

require('dotenv').config()

const corsOptions = {
    origin: ['http://localhost:3000', 'https://duoduo.lol'], // 허락하고자 하는 요청 주소
    credentials: true, // true로 하면 설정한 내용을 response 헤더에 추가 해줍니다.
}

app.use(cors(corsOptions))
app.use(express.json({ limit: '5mb' }))
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false, limit: '5mb' }))
app.disable('x-powered-by')

app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        cookie: {
            domain: '.duoduo.lol',
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        },
    })
)
const connect = require('./schemas')
connect()
passportConfig()

app.use(passport.initialize())
app.use(passport.session())

app.use('/', Router)

module.exports = app
