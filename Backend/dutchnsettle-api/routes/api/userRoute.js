
var express = require('express');
const isAuthenticated = require('../../middleware/authMiddleware');
const UserController = require('../../controllers/user/userController');
var router = express.Router();

router.post('/', isAuthenticated, UserController.newUser);
router.get('/', isAuthenticated, UserController.fetchUserByEmail);
router.get('/search', isAuthenticated, UserController.searchUsers);
router.get('/:id', isAuthenticated, UserController.fetchUserById);
router.put('/', isAuthenticated, UserController.updateUserDetails);

module.exports = router;