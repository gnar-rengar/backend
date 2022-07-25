const axios = require('axios')
const User = require('../schemas/user')
const Chat = require('../schemas/chat')
const ChatRoom = require('../schemas/chatroom')
require('dotenv').config()

const riotToken = process.env.riotTokenKey

async function summoner(req, res) {
    const nickname = '배죤나고픔'

    const summoner = await axios({
        method: 'GET',
        url: encodeURI(
            `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${nickname}`
        ),
        headers: {
            'X-Riot-Token': riotToken,
        },
    })

    console.log(summoner.data)

    return res.status(200).json({ success: true })
}

async function matchList(req, res) {
    const puuid =
        'kFcpt5RahFNF1rfruQN71JKq58PRjVQgOzJnx4kKeLUU6oFbqsFzDp42dK09cIoh817YaaRDv_g1pA'

    const matchList = await axios({
        method: 'GET',
        url: encodeURI(
            `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20`
        ),
        headers: {
            'X-Riot-Token': riotToken,
        },
    })

    console.log(matchList.data)

    return res.status(200).json({ success: true })
}

async function match(req, res) {
    const matchId = 'KR_6002765651'

    const match = await axios({
        method: 'GET',
        url: encodeURI(
            `https://asia.api.riotgames.com/lol/match/v5/matches/${matchId}`
        ),
        headers: {
            'X-Riot-Token': riotToken,
        },
    })

    console.log(match.data)
    console.log(match.data.info.participants[0])
    console.log(match.data.info.participants[0].summonerName)

    return res.status(200).json({ success: true })
}

async function createUser(req, res) {
    const nickname = 'bb'

    console.log(User)
    await User.create({
        nickname,
    })

    return res.status(200).json({ success: true })
}

async function test(req, res) {
    const roomId = '62d565601115b1eb5763d761'
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

    console.log(chat[0])

    res.send({ success: true })
}

async function test2(req, res) {
    const userId = '62d509be151f1fb3b2e0f792'
    const currentUser = await User.findOne({ _id: userId })
    const playStyle = currentUser.playStyle
    console.log(playStyle)

    // const list = await User.aggregate([
    //     { $match: { playStyle: { $in: playStyle } }},
    // ])

    const list = await User.find({
        playStyle: { $in: playStyle },
    })
    console.log(list)

    res.send({ success: true })
}

async function test3(req, res) {
    const chat = await Chat.create({ text: 'ㅋㅋ ' })

    console.log(chat)
}

async function test4(req, res) {
    const userId = '62d509be151f1fb3b2e0f792'

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
        array.lastMessage = lastMessage[0].text
        array.createdAt = room[i].createdAt
        const unReadMessage = await Chat.find({
            userId: { $ne: userId },
            roomId: room[i].id,
            isRead: false,
        })
        array.unRead = unReadMessage.length
        data.push(array)
    }

    console.log(data)
}

async function test5(req,res) {
    // try{
    //     new Error('ㅋㅋㅋㅋㅋ')
    // } catch (error){
    //     console.log(error)
    //     res.json({message:'ㅋㅋ'})
    // }
    res.json({message:'ㅋㅋ'})
    res.json({message:'ㅋㅋ'})
}

module.exports = {
    summoner,
    matchList,
    match,
    createUser,
    test,
    test2,
    test3,
    test4,
    test5,
}
