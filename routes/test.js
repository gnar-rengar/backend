const router = require("express").Router()
const testController = require("../controller/test")

router.get("/summoner", testController.summoner)
router.get("/matchList", testController.matchList)
router.get("/match", testController.match)

router.post("/createUser", testController.createUser)

module.exports = router