const router = require("express").Router()
const passport = require('passport')
const authController = require("../controllers/auth")

router.get('/kakao', passport.authenticate('kakao'))
router.get('/kakao/callback', authController.kakaoCallback)

router.get('/google', passport.authenticate('google'))
router.get('/google/callback', authController.googleCallback)

router.get('/naver', passport.authenticate('naver', { authType: 'reprompt' }))
router.get('/naver/callback', authController.naverCallback)

router.get('/', authController.checkMyInfo)

router.post('/checkNick', authController.checkNick)


router.delete('/logout', authController.logout)
router.delete('/deleteUser', authController.deleteUser)

module.exports = router