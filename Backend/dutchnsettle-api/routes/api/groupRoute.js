
var express = require('express');
const isAuthenticated = require('../../middleware/authMiddleware');
const GroupController = require('../../controllers/group/groupController');
var router = express.Router();

router.post('/member', isAuthenticated, GroupController.addMember);
router.post('/', isAuthenticated, GroupController.createGroup);
router.get('/user/:id', isAuthenticated, GroupController.fetchGroupsForUser);
router.get('/:id', isAuthenticated, GroupController.fetchGroup);

module.exports = router;