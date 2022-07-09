const router = require("express").Router()
const multer = require('../middlewares/multers/multer')
const onboardingController = require("../controllers/onboarding")

router.get('/checkNick', onboardingController.checkNick)
router.patch('/', multer.upload.single('profileImage'), onboardingController.updateOnboarding)
router.get('/', onboardingController.getOnboarding)

module.exports = router