const router = require('express').Router()
const testController = require('../controllers/test')
const multer = require('../middlewares/multers/multer')

router.get('/summoner', testController.summoner)
router.get('/matchList', testController.matchList)
router.get('/match', testController.match)

router.post('/createUser', testController.createUser)

router.post('/image', multer.upload.single('image'), (req, res) => {
    res.send('good!')
})

router.get('', testController.test)
router.get('/2', testController.test2)

module.exports = router
