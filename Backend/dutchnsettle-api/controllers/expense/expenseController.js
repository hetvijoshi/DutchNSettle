const { addExpense, addExpenseDetails } = require("../../services/expense/expenseService");
const { updateGroup } = require("../../services/group/groupService");
const { getFriendsListByUserId } = require("../../services/user/friendsService");
const { getUserDetailsById } = require("../../services/user/userService");

class ExpenseController {
    static async addExpense(req, res) {
        try {
            const payload = req.body;
            const { paidBy } = payload;

            if (paidBy) {
                const user = await getUserDetailsById(paidBy);

                if (user) {
                    payload.groupId = undefined;
                    let expense = await addExpense(payload);
                    expense.save();
                    if (expense) {

                        let expenseDetailPayload = payload.shares?.map(share => {
                            return {
                                expenseId: expense._id,
                                paidFor: share.paidFor,
                                amount: share.amount,
                                splitType: share.splitType
                            };
                        });

                        let expenseDetails = await addExpenseDetails(expenseDetailPayload);
                        if (expenseDetails) {
                            let paidByUser = await getFriendsListByUserId(paidBy);
                            expenseDetailPayload.map(async (share) => {
                                let friend1 = paidByUser.friends.find(f => f.user._id.toString() == share.paidFor);
                                friend1.amount = friend1.amount + share.amount;
                                let paidForUser = await getFriendsListByUserId(share.paidFor);
                                let friend2 = paidForUser.friends.find(f => f.user._id.toString() == paidBy);
                                friend2.amount = friend2.amount - share.amount;
                                paidByUser.save();
                                paidForUser.save();
                            });
                        }
                        return res.status(200).json({
                            type: "success",
                            message: "Success result",
                            data: { expense, expenseDetails },
                        });
                    } else {
                        return res.status(200).json({
                            type: "success",
                            message: "Success result",
                            data: null,
                        });
                    }
                }
            }
        } catch (error) {
            return res.status(500).json({
                type: "error",
                message: error.message || "Unhandled Error",
                error,
            });
        }
    }

    static async addGroupExpense(req, res) {
        try {
            const payload = req.body;
            const { paidBy, groupId } = payload;

            if (paidBy) {
                const user = await getUserDetailsById(paidBy);
                let groupDetail = await updateGroup(groupId);
                if (user && groupDetail) {
                    payload.groupId = groupId;
                    let expense = await addExpense(payload);
                    expense = await expense.save();
                    if (expense) {
                        let expenseDetailPayload = payload.shares?.map(share => {
                            return {
                                expenseId: expense._id,
                                paidFor: share.paidFor,
                                amount: share.amount,
                                splitType: share.splitType
                            };
                        });

                        let expenseDetails = await addExpenseDetails(expenseDetailPayload);
                        if (expenseDetails) {
                            let paidByUser = await getFriendsListByUserId(paidBy);
                            let paidByGroupUser = groupDetail.groupMembers.find(member => member.user.toString() == paidBy);
                            expenseDetailPayload.map(async (share) => {
                                let friend1 = paidByUser.friends.find(f => f.user._id.toString() == share.paidFor);
                                friend1.amount = friend1.amount + share.amount;

                                paidByGroupUser.amount = paidByGroupUser.amount + share.amount;
                                groupDetail.save();

                                let paidForUser = await getFriendsListByUserId(share.paidFor);
                                let friend2 = paidForUser.friends.find(f => f.user._id.toString() == paidBy);
                                friend2.amount = friend2.amount - share.amount;

                                let paidForGroupUser = groupDetail.groupMembers.find(member => member.user.toString() == paidFor);
                                paidByGroupUser.amount = paidForGroupUser.amount - share.amount;
                                groupDetail.save();

                                paidByUser.save();
                                paidForUser.save();
                            });
                        }
                        return res.status(200).json({
                            type: "success",
                            message: "Success result",
                            data: { expense, expenseDetails },
                        });
                    } else {
                        return res.status(200).json({
                            type: "success",
                            message: "Success result",
                            data: null,
                        });
                    }
                }
            }
        } catch (error) {
            return res.status(500).json({
                type: "error",
                message: error.message || "Unhandled Error",
                error,
            });
        }
    }

    static async addExpenseDetails(req, res) {
        try {
            const payload = req.body;
            let expense = await addExpenseDetails(payload);
            expense.save();
            if (expense) {
                return res.status(200).json({
                    type: "success",
                    message: "Success result",
                    data: expense,
                });
            } else {
                return res.status(200).json({
                    type: "success",
                    message: "Success result",
                    data: null,
                });
            }

        } catch (error) {
            return res.status(500).json({
                type: "error",
                message: error.message || "Unhandled Error",
                error,
            });
        }
    }
}

module.exports = ExpenseController