var express = require('express');
const isAuthenticated = require('../../middleware/authMiddleware');
const ExpenseController = require('../../controllers/expense/expenseController');
var router = express.Router();

router.post('/', isAuthenticated, ExpenseController.addExpense);
router.post('/group/', isAuthenticated, ExpenseController.addGroupExpense);

module.exports = router;