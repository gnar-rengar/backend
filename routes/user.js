const router = require("express").Router()
const multer = require('../middlewares/multers/multer')
const userController = require("../controllers/user")

//onboarding 관련
router.get('/checkNick', userController.checkNick)
router.patch('/onboarding', multer.upload.single('profileImage'), userController.updateOnboarding)
router.get('/onboarding', userController.getOnboarding)

//review 관련
router.get('/getReview/:userId', userController.getReview)
router.patch('/writeReview/:userId', userController.writeReview)

//user-profile 관련
router.get('/userInfo/:userId', userController.userInfo)
router.get('/recentRecord/:userId', userController.recentRecord)

module.exports = router