const router = require("express").Router()
const auth = require("./../middlewares/auth")
const PostController = require("./../controllers/post")

router.post("/", auth(), PostController.create)
router.patch("/:post_id", auth(), PostController.update)
router.get("/", PostController.getAll)
router.get("/:post_id", PostController.getOne)
router.delete("/:post_id", auth(), PostController.delete)



module.exports = router