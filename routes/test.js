const router = require("express").Router()
const testController = require("../controller/test")

router.get("/summoner", testController.summoner)
router.get("/matchList", testController.matchList)

module.exports = router