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
        transports: ['websocket', 'polling'],
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
                    date: 1,
                },
            },
            {
                $group: {
                    _id: '$date',
                    obj: {
                        $push: {
                            text: '$text',
                            userId: '$userId',
                            createdAt: '$createdAt',
                        },
                    },
                },
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $let: {
                            vars: {
                                obj: [
                                    {
                                        k: { $substr: ['$_id', 0, -1] },
                                        v: '$obj',
                                    },
                                ],
                            },
                            in: { $arrayToObject: '$$obj' },
                        },
                    },
                },
            },
        ])

        await Chat.updateMany(
            { roomId, isRead: false },
            { $set: { isRead: true } }
        )

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

        const newChat = await Chat.create(chat)
        io.to(roomId).emit('receiveMessage', newChat)
    })

    socket.on('typing', async (roomId) => {
        // socket.broadcast.to(roomId).emit('onTyping')
        io.to(roomId).emit('onTyping')
    })

    socket.on('endTyping', async (roomId) => {
        // socket.broadcast.to(roomId).emit('onEndTyping')
        io.to(roomId).emit('onEndTyping')
    })

    socket.on('getChatRoom', async (userId) => {
        const room = await ChatRoom.find({ userId: { $in: userId } })

        console.log('@@')

        let data = []
        for (let i = 0; i < room.length; i++) {
            let array = {}
            array.roomId = room[i].id
            const opponentId = room[i].userId.find((x) => x != userId)
            array.userId = opponentId
            const opponent = await User.findOne({ _id: opponentId })
            array.profileUrl = opponent.profileUrl
            array.lolNickname = opponent.lolNickname

            const allMessage = await Chat.find({ roomId: room[i].id })
            const sortingField = 'createdAt'
            const lastMessage = allMessage.sort(function (a, b) {
                return b[sortingField] - a[sortingField]
            })
            array.lastMessage = lastMessage[0].text
            array.createdAt = room[i].createdAt
            const unReadMessage = await Chat.find({
                roomId: room[i].id,
                isRead: false,
            })
            array.unRead = unReadMessage.length
            data.push(array)
        }

        socket.emit('onGetChatRoom', data)
    })
})

module.exports = { server }
