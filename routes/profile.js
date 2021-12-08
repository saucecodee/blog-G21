const router = require("express").Router()
const auth = require("./../middlewares/auth")
const ProfileController = require("./../controllers/profile")

router.get("/:user_id", ProfileController.view)
router.patch("/", auth(), ProfileController.edit)
router.delete("/", auth(), ProfileController.delete)

module.exports = router