const app = require('./app')
const fs = require('fs')
const http = require('http')
const https = require('https')
const ChatRoom = require('./schemas/chatroom')
const Chat = require('./schemas/chat')

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

const io = require('socket.io')(server, {
    cors: {
        origin: [
            'http://localhost:3000',
        ],
        credentials: true,
    },
    autoConnect: false,
    allowEIO3: true,
})

io.on('connection', (socket) => {
    console.log('socketId : ', socket.id)

    socket.on('disconnect', () => {
        console.log('disconnect socketId : ', socket.id)
    })

    socket.on('makeChatRoom', async (user1, user2) => {
        const array = [ user1, user2 ].sort()
        await ChatRoom.create({ userId: array })
    })
})

module.exports = { server }