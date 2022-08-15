const router = require('express').Router()

const auth = require('./auth')
const chat = require('./chat')
const duo = require('./duo')
const onboarding = require('./onboarding')
const user = require('./user')

router.use('/auth', auth)
router.use('/chat', chat)
router.use('/duo', duo)
router.use('/onboarding', onboarding)
router.use('/user', user)

module.exports = router
