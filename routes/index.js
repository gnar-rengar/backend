const router = require('express').Router()

const test = require('./test')
const auth = require('./auth')
const duo = require('./duo')
const onboarding = require('./onboarding')
const user = require('./user')

router.use('/test', test)
router.use('/auth', auth)
router.use('/duo', duo)
router.use('/onboarding', onboarding)
router.use('/user', user)

module.exports = router
