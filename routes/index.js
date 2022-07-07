const router = require('express').Router()

const test = require("./test")
const auth = require("./auth")
const onboarding = require("./onboarding")
const user = require("./user")

router.use('/test', test)
router.use('/auth', auth)
router.use('/onboarding', onboarding)
router.use('/user', user)

module.exports = router