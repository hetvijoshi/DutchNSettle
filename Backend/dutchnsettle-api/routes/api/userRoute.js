
var express = require('express');
const isAuthenticated = require('../../middleware/authMiddleware');
const UserController = require('../../controllers/user/userController');
const { createUserEntityValidator, fetchUserValidator, searchUserValidator, fetchUserIdValidator, updateUserValidator } = require('../../middleware/user/userValidator');
var router = express.Router();

router.post('/', isAuthenticated, createUserEntityValidator, UserController.newUser);
router.get('/', isAuthenticated, fetchUserValidator, UserController.fetchUserByEmail);
router.get('/search', isAuthenticated, searchUserValidator, UserController.searchUsers);
router.get('/:id', isAuthenticated, fetchUserIdValidator, UserController.fetchUserById);
router.put('/', isAuthenticated, updateUserValidator, UserController.updateUserDetails);

module.exports = router;