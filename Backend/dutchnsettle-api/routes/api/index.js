const router = require("express").Router();

router.use("/user", require("./userRoute"));
router.use("/friends", require("./friendsRoute"));
router.use("/group", require("./groupRoute"));
router.use("/expense", require("./expenseRoute"));
module.exports = router;