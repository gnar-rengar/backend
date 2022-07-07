const router = require("express").Router()
const multer = require('../middlewares/multers/multer')
const onboardingController = require("../controllers/onboarding")

router.get('/checkNick', onboardingController.checkNick)
router.patch('/onboarding', multer.upload.single('profileImage'), onboardingController.updateOnboarding)
router.get('/onboarding', onboardingController.getOnboarding)

module.exports = router