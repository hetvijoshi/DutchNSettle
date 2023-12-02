const { Expense, ExpenseDetail } = require("../../models");

exports.addExpense = (data) => {
    let result;
    try {
        result = new Expense(data);
    } catch (error) {
        return Promise.reject(error);
    }
    return result;

}

exports.addExpenseDetails = (data) => {
    let result;
    try {
        result = ExpenseDetail.collection.insertMany(data);
    } catch (error) {
        return Promise.reject(error);
    }
    return result;
}