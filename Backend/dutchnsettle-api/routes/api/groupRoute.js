
var express = require('express');
const isAuthenticated = require('../../middleware/authMiddleware');
const GroupController = require('../../controllers/group/groupController');
const { addMemberValidator, createGroupValidator, fetchGroupsValidator } = require('../../middleware/group/groupValidator');
var router = express.Router();

router.post('/member', isAuthenticated, addMemberValidator, GroupController.addMember);
router.post('/', isAuthenticated, createGroupValidator, GroupController.createGroup);
router.get('/user/:id', isAuthenticated, fetchGroupsValidator, GroupController.fetchGroupsForUser);
router.get('/:id', isAuthenticated, fetchGroupsValidator,GroupController.fetchGroup);

module.exports = router;