const router = require("express").Router();

router.use("/user", require("./userRoute"));
router.use("/friends", require("./friendsRoute"));
router.use("/group", require("./groupRoute"));
module.exports = router;