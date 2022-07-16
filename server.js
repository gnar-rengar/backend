const app = require('./app')
const port = process.env.PORT || 3000
const fs = require('fs')
const http = require('http')
const https = require('https')

require('dotenv').config()

let server = ''
if (process.env.PORT) {
    // Certificate 인증서 경로
    const privateKey = fs.readFileSync(process.env.SSL_PRIVATEKEY, 'utf8')
    const certificate = fs.readFileSync(process.env.SSL_CERTIFICATE, 'utf8')
    const ca = fs.readFileSync(process.env.SSL_CA, 'utf8')

    const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca,
    }
    server = https.createServer(credentials, app)
} else {
    server = http.createServer(app)
}

server.listen(port, () => {
    console.log(port, '번으로 서버가 연결되었습니다.')
    console.log(`http://localhost:${port}`)
})
