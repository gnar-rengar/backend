const router = require('express').Router()
const duoController = require('../controllers/duo')
const { checkTokens } = require('../middlewares/auth')

router.get('/customList', checkTokens, duoController.customList)
router.get('/newList', duoController.newList)

module.exports = router
