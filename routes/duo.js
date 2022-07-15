const router = require('express').Router()
const duoController = require('../controllers/duo')

router.get('/customList', duoController.customList)
router.get('/newList', duoController.newList)

module.exports = router
