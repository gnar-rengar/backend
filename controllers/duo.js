const User = require('../schemas/user')
var mongoose = require('mongoose')
const moment = require('moment')

async function customList(req, res) {
    // let userId = res.locals.userId
    let userId = '62e1685075271273d5e68456'
    userId = mongoose.Types.ObjectId(userId)

    try {
        const currentUser = await User.findOne({ _id: userId })

        const sortingField = 'count'
        const customUser = await User.aggregate([
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

        const customList = customUser
            .sort(function (a, b) {
                return b[sortingField] - a[sortingField]
            })
            .slice(0, 3)
        console.log(customList)

        const date = moment().format('YYYY년 M월 D일')
        console.log(date)

        for (let i = 0; i < customList.length; i++) {
            console.log(customUser[i]._id)
            await User.updateOne(
                { _id: userId },
                {
                    $push: { 'todaysCustom.$.userId': customUser[i].id },
                    $set: {
                        date: date,
                    },
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

        const userList = await User.find({ tier: { $in: tierList } })
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
