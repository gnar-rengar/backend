const axios = require('axios')
const User = require('../schemas/user')

const riotToken = 'RGAPI-33e075a5-4dbe-483f-8de9-fd46c46e14fe'

async function summoner(req, res) {

    const nickname = '배죤나고픔'

    const summoner = await axios({
        method: 'GET',
        url: encodeURI(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${nickname}`),
        headers: {
            "X-Riot-Token": riotToken
        },
    })

    console.log(summoner.data)

    return res.status(200).json({ success: true })
}

async function matchList(req, res){

    const puuid = 'kFcpt5RahFNF1rfruQN71JKq58PRjVQgOzJnx4kKeLUU6oFbqsFzDp42dK09cIoh817YaaRDv_g1pA'

    const matchList = await axios({
        method: 'GET',
        url: encodeURI(`https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20`),
        headers: {
            "X-Riot-Token": riotToken
        },
    })

    console.log(matchList.data)

    return res.status(200).json({ success: true })
}

async function match(req, res){

    const matchId = 'KR_5969904649'

    const match = await axios({
        method: 'GET',
        url: encodeURI(`https://asia.api.riotgames.com/lol/match/v5/matches/${matchId}`),
        headers: {
            "X-Riot-Token": riotToken
        },
    })

    console.log(match.data)
    console.log(match.data.info.participants[0])

    return res.status(200).json({ success: true })
}

async function createUser(req, res){
    const userId= 'aa'
    const nickName = 'bb'
    const password = 'cc'

    await User.create({
        userId,
        nickName,
        password
    })

    return res.status(200).json({ success: true })
}

module.exports = {
    summoner,
    matchList,
    match,
    createUser
}