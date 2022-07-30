const router = require('express').Router()
const multer = require('../middlewares/multers/multer')
const userController = require('../controllers/user')
const { checkTokens } = require('../middlewares/auth')

//review 관련
router.patch('/writeReview/:userId', checkTokens, userController.writeReview)

//user-profile 관련
router.get('/roomId/:userId', checkTokens, userController.getRoomId)
router.get('/userInfo/:userId', userController.userInfo)
router.get('/recentRecord/:userId', userController.recentRecord)

router.get('/mypage', checkTokens, userController.mypage)

module.exports = router
