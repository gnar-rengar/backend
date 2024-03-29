const router = require('express').Router()
const multer = require('../middlewares/multers/multer')
const userController = require('../controllers/user')
const { checkTokens } = require('../middlewares/auth')

//review 관련
router.patch('/writeReview/:userId', checkTokens, userController.writeReview)

//user-profile 관련
router.get('/userInfo/:userId', userController.userInfo)
router.get('/recentRecord/:userId', userController.recentRecord)

router.get('/mypage', checkTokens, userController.mypage)
router.get('/phoneNumber', checkTokens, userController.getPhoneNumber)
router.patch('/agreeSMS', checkTokens, userController.agreeSMS)
router.post('/sendSMS', checkTokens, userController.sendSMS)
router.patch('/firstLogin', checkTokens, userController.firstLogin)

module.exports = router
