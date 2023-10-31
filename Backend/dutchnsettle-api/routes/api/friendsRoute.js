
var express = require('express');
const isAuthenticated = require('../../middleware/authMiddleware');
const FriendsController = require('../../controllers/user/friendsController');
var router = express.Router();

router.get('/', isAuthenticated, FriendsController.getFriends);
router.post('/', isAuthenticated, FriendsController.addFriend);

module.exports = router;