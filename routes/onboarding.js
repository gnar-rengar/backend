const router = require('express').Router()
const multer = require('../middlewares/multers/multer')
const onboardingController = require('../controllers/onboarding')
const { checkTokens } = require('../middlewares/auth')

router.get('/checkNick', onboardingController.checkNick)
router.patch(
    '/',
    checkTokens,
    multer.upload.single('profileImage'),
    onboardingController.updateOnboarding
)
router.get('/', checkTokens, onboardingController.getOnboarding)

module.exports = router
