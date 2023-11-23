
var express = require('express');
const isAuthenticated = require('../../middleware/authMiddleware');
const FriendsController = require('../../controllers/user/friendsController');
const { fetchFriendsValidator, addFriendValidator } = require('../../middleware/friend/friendsValidator');
var router = express.Router();

router.get('/', isAuthenticated, fetchFriendsValidator, FriendsController.getFriends);
router.post('/', isAuthenticated, addFriendValidator, FriendsController.addFriend);

module.exports = router;