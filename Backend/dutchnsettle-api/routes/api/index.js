const router = require("express").Router();

router.use("/user", require("./userRoute"));
router.use("/friends", require("./friendsRoute"));
module.exports = router;