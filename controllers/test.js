const axios = require('axios')
const User = require('../schemas/user')
const Chat = require('../schemas/chat')
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
            $group: {
                _id: "$date",
                obj: { $push: { roomId: "$roomId", text: "$text", userId: "$userId", createdAt: "$createdAt" } }
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

    console.log(chat[0])

    res.send({ success: true })
}

module.exports = {
    summoner,
    matchList,
    match,
    createUser,
    test,
}
