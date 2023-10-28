
var express = require('express');
const isAuthenticated = require('../../middleware/authMiddleware');
const UserController = require('../../controllers/user/userController');
var router = express.Router();

router.post('/', isAuthenticated, UserController.newUser);
router.get('/', isAuthenticated, UserController.fetchUserByEmail);
router.get('/:id', isAuthenticated, UserController.fetchUserById);

module.exports = router;