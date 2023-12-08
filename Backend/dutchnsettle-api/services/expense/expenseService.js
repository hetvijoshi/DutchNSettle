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

exports.getUserBalance = async (id) => {
    let result;
    try {
        let matchQuery = {}
        result = await ExpenseDetail.find(matchQuery)
            .populate("paidBy")
            .populate("paidFor")
            .populate("expenseId")
            .populate({ path: "expenseId", populate: { path: "paidBy" } })
            .sort({ "expenseId.expenseDate": "desc" });

    } catch (error) {
        return Promise.reject(error);
    }
    return result;
}

exports.getExpenseOverview = async (id) => {
    let result;
    try {

        let matchQuery = { groupId: id }
        result = await Expense.find(matchQuery).populate("paidBy")
    }
    catch (error) {
        return Promise.reject(error);
    }
    return result;
}

exports.getExpenseDetail = async (ids) => {
    let result;
    try {
        result = await ExpenseDetail.find({ expenseId: { $in: ids } }).populate("paidBy").populate("paidFor").populate("expenseId");
    }
    catch (error) {
        return Promise.reject(error);
    }
    return result
}