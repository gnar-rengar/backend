const User = require('../schemas/user')
var mongoose = require('mongoose')
const moment = require('moment')

async function customList(req, res) {
    let userId = res.locals.userId

    if (!userId) {
        return res.status(401).json({
            message: '로그인이 필요합니다.',
        })
    } else {
        userId = mongoose.Types.ObjectId(userId)
    }

    try {
        const currentUser = await User.findOne({ _id: userId })
        const date = moment().format('YYYY년 M월 D일')
        let customList = []

        if (currentUser.customDate == date) {
            // 12시 지나기 전
            for (let i = 0; i < currentUser.todaysCustom.length; i++) {
                const thisUser = await User.findOne({
                    _id: currentUser.todaysCustom[i],
                }).select({
                    social: 0,
                    socialId: 0,
                    nickname: 0,
                    voiceChannel: 0,
                    banId: 0,
                    todaysCustom: 0,
                    createdAt: 0,
                    updatedAt: 0,
                    __v: 0,
                    communication: 0,
                    customDate: 0,
                })
                customList.push(thisUser)
            }
        } else {
            // 12시 지나고 후 && 처음 customList 검색 시
            // playStyle 일치하는 순으로 _id값과 count만 배열
            const allCustomUser = await User.aggregate([
                { $match: { _id: { $ne: userId } } },
                { $unwind: '$playStyle' },
                { $match: { playStyle: { $in: currentUser.playStyle } } },
                {
                    $group: {
                        _id: '$_id',
                        count: { $sum: 1 },
                    },
                },
            ])

            // count 높은순으로 sort 하면서 3개 slice
            const sortingField = 'count'
            const customUser = allCustomUser
                .sort(function (a, b) {
                    return b[sortingField] - a[sortingField]
                })
                .slice(0, 3)

            let customIdList = []

            // customIdList에 해당 _id값 담으면서 customList에 해당 유저 push
            for (let i = 0; i < customUser.length; i++) {
                const customId = customUser[i]._id.toString()
                customIdList.push(customId)
                const thisUser = await User.findOne({
                    _id: customId,
                }).select({
                    social: 0,
                    socialId: 0,
                    nickname: 0,
                    voiceChannel: 0,
                    banId: 0,
                    todaysCustom: 0,
                    createdAt: 0,
                    updatedAt: 0,
                    __v: 0,
                    communication: 0,
                    customDate: 0,
                })
                customList.push(thisUser)
            }

            await User.updateOne(
                { _id: userId },
                {
                    $set: { todaysCustom: customIdList, customDate: date },
                }
            )
        }

        res.json({
            customList,
        })
    } catch (error) {
        console.log(error)
        res.json({
            message: '맞춤소환사 리스트 불러오기에 실패하였습니다.',
        })
    }
}

async function newList(req, res) {
    try {
        const tierList = req.query.tier
        const page = req.query.page
        const size = 10
        let userList

        if (tierList) {
            userList = await User.find({ tier: { $in: tierList } }).select({
                social: 0,
                socialId: 0,
                nickname: 0,
                voiceChannel: 0,
                banId: 0,
                todaysCustom: 0,
                createdAt: 0,
                updatedAt: 0,
                __v: 0,
                communication: 0,
                customDate: 0,
            })
        } else {
            userList = await User.find({ lolNickname: { $ne: null } }).select({
                social: 0,
                socialId: 0,
                nickname: 0,
                voiceChannel: 0,
                banId: 0,
                todaysCustom: 0,
                createdAt: 0,
                updatedAt: 0,
                __v: 0,
                communication: 0,
                customDate: 0,
            })
        }

        const sortingField = 'createdAt'
        let newList

        if (page) {
            newList = userList
                .sort(function (a, b) {
                    return b[sortingField] - a[sortingField]
                })
                .slice((page - 1) * size, size * page)
        } else {
            newList = userList
                .sort(function (a, b) {
                    return b[sortingField] - a[sortingField]
                })
                .slice(0, 3)
        }

        res.json({
            newList,
        })
    } catch (error) {
        console.log(error)
        res.json({
            message: 'new소환사 리스트 불러오기에 실패하였습니다.',
        })
    }
}

module.exports = {
    customList,
    newList,
}
