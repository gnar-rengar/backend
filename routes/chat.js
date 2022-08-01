const router = require('express').Router()
const chatController = require('../controllers/chat')
const { checkTokens } = require('../middlewares/auth')

//채팅 관련
router.get('/roomId/:userId', checkTokens, chatController.getRoomId)
router.get('/opponent/:roomId', checkTokens, chatController.getOpponent)
router.get('/message/:roomId', checkTokens, chatController.getChat)

module.exports = router
