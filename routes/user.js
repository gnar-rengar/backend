const router = require("express").Router()
const multer = require('../middlewares/multers/multer')
const userController = require("../controllers/user")

//review 관련
router.patch('/writeReview/:userId', userController.writeReview)

//user-profile 관련
router.get('/userInfo/:userId', userController.userInfo)
router.get('/recentRecord/:userId', userController.recentRecord)

module.exports = router