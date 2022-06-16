const axios = require('axios')

const riotToken = 'RGAPI-27fb5130-23d2-4a5d-b859-662e665711db'

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

module.exports = {
    summoner,
    matchList
}