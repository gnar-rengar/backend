const router = require("express").Router()
const multer = require('../middlewares/multers/multer')
const userController = require("../controllers/user")

router.get('/checkNick', userController.checkNick)
router.patch('/onboarding', multer.upload.single('profileImage'), userController.updateOnboarding)
router.get('/onboarding', userController.getOnboarding)

router.get('/getReview/:userId', userController.getReview)
router.patch('/writeReview/:userId', userController.writeReview)

module.exports = router