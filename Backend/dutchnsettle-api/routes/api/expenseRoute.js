var express = require('express');
const isAuthenticated = require('../../middleware/authMiddleware');
const ExpenseController = require('../../controllers/expense/expenseController');
const { individualExpenseValidator, groupExpenseValidator } = require('../../middleware/expense/expenseValidator');
var router = express.Router();

router.get('/:id/:friendId', isAuthenticated, ExpenseController.fetchUserExpense);
router.post('/', isAuthenticated, ExpenseController.addExpense);
router.post('/group/', isAuthenticated, groupExpenseValidator, ExpenseController.addGroupExpense);

module.exports = router;