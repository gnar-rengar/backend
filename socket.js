const app = require('./app')
const fs = require('fs')
const http = require('http')
const https = require('https')
const ChatRoom = require('./schemas/chatroom')
const Chat = require('./schemas/chat')
const User = require('./schemas/user')
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
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://duo-duo.ga',
        ],
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

    // socket.on('makeChatRoom', async (user1, user2) => {
    //     const array = [user1, user2].sort()
    //     const room = await ChatRoom.create({ userId: array })
    //     const roomId = room._id

    //     socket.emit('onMakeChatRoom', roomId)
    // })

    socket.on('enterChatRoom', async (roomId, userId) => {
        socket.join(roomId)

        await Chat.updateMany(
            { userId: { $ne: userId }, roomId, isRead: false },
            { $set: { isRead: true } }
        )
    })

    socket.on('sendMessage', async (roomId, userId, text, callback) => {
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

    socket.on('readMessage', async (roomId, userId) => {
        await Chat.updateMany(
            { userId: { $ne: userId }, roomId, isRead: false },
            { $set: { isRead: true } }
        )
    })

    socket.on('typing', async (roomId) => {
        socket.broadcast.to(roomId).emit('onTyping')
        // io.to(roomId).emit('onTyping')
    })

    socket.on('endTyping', async (roomId) => {
        socket.broadcast.to(roomId).emit('onEndTyping')
        // io.to(roomId).emit('onEndTyping')
    })

    socket.on('getChatRooms', async (userId) => {
        const room = await ChatRoom.find({ userId: { $in: userId } })

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
            if (lastMessage[0]) {
                array.lastMessageText = lastMessage[0].text
                array.lastMessagedTime = lastMessage[0].createdAt
            }
            const unReadMessage = await Chat.find({
                userId: { $ne: userId },
                roomId: room[i].id,
                isRead: false,
            })
            array.unRead = unReadMessage.length
            data.push(array)
        }

        socket.emit('onGetChatRooms', data)
    })
})

module.exports = { server }
