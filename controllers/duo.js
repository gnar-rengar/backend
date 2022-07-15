const User = require('../schemas/user')

async function customList (req, res) {
    // const userId = res.locals.userId
    const userId = '62bfd94f10fe87a93848aa59'

    try{
        const currentUser = await User.findOne({ _id: userId })

        User.find().where

        console.log(currentUser.playStyle)
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
    const userId = '62bfd94f10fe87a93848aa59'

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