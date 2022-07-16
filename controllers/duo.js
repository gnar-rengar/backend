const User = require('../schemas/user')

async function customList (req, res) {
    // const userId = res.locals.userId
    const userId = '62d2611ce44a2bec67355e05'

    try{
        const currentUser = await User.findOne({ _id: userId })

        const allUser = await User.find({ playStyle: { $all: currentUser.playStyle[3] } })

        // console.log(currentUser.playStyle)
        console.log(allUser)
        res.send({
            success: true,
            message: '맞춤소환사 리스트',
        })
    } catch (error) {
        console.log(error)
        res.send({
            success: false,
            message: '맞춤소환사 리스트 불러오기에 실패하였습니다.',
        })
    }
}

async function newList (req, res) {
    // const userId = res.locals.userId
    const userId = '62d2611ce44a2bec67355e05'

    try{
        const currentUser = await User.findOne({ _id: userId })
    } catch (error) {
        console.log(error)
        res.send({
            success: false,
            message: 'new소환사 리스트 불러오기에 실패하였습니다.',
        })
    }
}

module.exports = {
    customList,
    newList
}