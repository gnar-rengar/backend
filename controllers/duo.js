const User = require('../schemas/user')

async function customList(req, res) {
    // const userId = res.locals.userId
    const userId = '62d509be151f1fb3b2e0f792'

    try {
        const currentUser = await User.findOne({ _id: userId })

        // const allUser = await User.find({
        //     playStyle: { $all: currentUser.playStyle[3] },
        // })
        // const customList = await User.aggregate([
        //     {
        //         $project: {
        //             _id: 1,
        //             social: 0,
        //             socialId: 0,
        //             nickname: 0,
        //             matchCount: {
        //                 $cond: { if: { $in:  } },
        //             }
        //         }
        //     }
        // ])

        console.log(customList)
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
        // const tierList = req.body.tierList
        const page = req.query.page
        const size = 10
        const tierList = ['PLATINUM', 'GOLD']
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
