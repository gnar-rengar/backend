const express = require('express')
const app = express()
const cors = require('cors')
const Router = require('./routes')

require('dotenv').config()

const corsOptions = {
    origin: [
        'http://localhost:3000',
    ], // 허락하고자 하는 요청 주소
    credentials: true, // true로 하면 설정한 내용을 response 헤더에 추가 해줍니다.
}

app.use(cors(corsOptions))
app.use(express.json({ limit: '5mb' }))
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false, limit: '5mb' }))
app.disable('x-powered-by')

app.use('/', Router)

module.exports = app
