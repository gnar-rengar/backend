const passport = require('passport')
const jwt = require('jsonwebtoken')
const User = require('../schemas/user')
const Chat = require('../schemas/chat')
const ChatRoom = require('../schemas/chatroom')
require('dotenv').config()

async function getRoomId(req, res) {
    const myId = res.locals.userId
    const userId = req.params.userId
    const array = [myId, userId].sort()

    try {
        const exChatroom = await ChatRoom.findOne({ userId: array })

        let roomId = ''
        if (exChatroom) {
            roomId = exChatroom._id
        } else {
            const room = await ChatRoom.create({ userId: array })
            roomId = room._id
        }

        res.status(200).json({
            roomId,
        })
    } catch (error) {
        res.json({
            message: '채팅방 아이디 불러오기에 실패하였습니다.',
        })
    }
}

async function getOpponent(req, res) {
    const userId = res.locals.userId
    const roomId = req.params.roomId

    try {
        const room = await ChatRoom.findOne({ _id: roomId })
        const opponentId = room.userId.find((x) => x != userId)
        const opponentUser = await User.findOne({ _id: opponentId })

        let opponent = {}
        opponent.userId = opponentUser._id
        opponent.profileUrl = opponentUser.profileUrl
        opponent.lolNickname = opponentUser.lolNickname

        res.status(200).json({
            opponent,
        })
    } catch (error) {
        console.log(error)
        res.json({
            message: '상대 정보 불러오기에 실패하였습니다.',
        })
    }
}

async function getChat(req, res) {
    const roomId = req.params.roomId

    try {
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
                            isRead: '$isRead',
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

        res.status(200).json({
            chat,
        })
    } catch (error) {
        console.log(error)
        res.json({
            message: '채팅 내역 불러오기에 실패하였습니다.',
        })
    }
}

module.exports = {
    getRoomId,
    getOpponent,
    getChat,
}
