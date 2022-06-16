const router = require('express').Router()

const test = require("./test")
const auth = require("./auth")

router.use('/auth', auth)

module.exports = router