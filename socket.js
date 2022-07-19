const app = require('./app')
const fs = require('fs')
const http = require('http')
const https = require('https')
const ChatRoom = require('./schemas/chatroom')
const Chat = require('./schemas/chat')
const moment = require('moment')

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
        origin: ['http://localhost:3000'],
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
        const array = [user1, user2].sort()
        await ChatRoom.create({ userId: array })
    })

    socket.on('enterChatRoom', async (roomId) => {
        socket.join(roomId)
        const chat = await Chat.aggregate([
            { $match: { roomId } },
            {
                $sort: {
                    date : 1
                }
            },
            {
                $group: {
                    _id: "$date",
                    obj: { $push: { text: "$text", userId: "$userId", createdAt: "$createdAt" } }
                }
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $let: {
                            vars: { obj: [ { k: {$substr:["$_id", 0, -1 ]}, v: "$obj" } ] },
                            in: { $arrayToObject: "$$obj" }
                        }
                    }
                }
            }
        ])

        await Chat.updateMany({ roomId, isRead: false }, { $set: { isRead: true } })

        socket.emit('onEnterChatRoom', chat)
    })

    socket.on('sendMessage', async (roomId, userId, text) => {
        const date = moment().format('YYYY년 M월 D일')
        const chat = {
            roomId,
            userId,
            text,
            date,
            isRead: false,
        }

        await Chat.create(chat)
        const newChat = await Chat.findOne({ roomId, userId, text, date })
        io.to(roomId).emit('receiveMessage', newChat)
    })
})

module.exports = { server }
