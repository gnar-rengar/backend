const router = require('express').Router()
const testController = require('../controllers/test')
const multer = require('../middlewares/multers/multer')
const { checkTokens } = require('../middlewares/auth')

router.post(
    '/',
    multer.upload.single('Image')
)

module.exports = router
