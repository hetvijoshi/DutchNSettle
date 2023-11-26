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
                            expenseDetailPayload.forEach(async (share) => {
                                if (share.paidFor != paidBy) {
                                    let friend1 = paidByUser.friends.find(f => f.user._id.toString() == share.paidFor);
                                    friend1.amount = friend1.amount + share.amount;
                                    let paidForUser = await getFriendsListByUserId(share.paidFor);
                                    let friend2 = paidForUser.friends.find(f => f.user._id.toString() == paidBy);
                                    friend2.amount = friend2.amount - share.amount;
                                    paidByUser.save();
                                    paidForUser.save();
                                }
                            })
                        }
                        return res.status(200).json({
                            type: "success",
                            message: "Success result",
                            data: { expense, expenseDetails },
                        });
                    } else {
                        return res.status(400).json({
                            type: "fail",
                            message: "Something went wrong",
                            data: null,
                        });
                    }
                } else {
                    return res.status(400).json({
                        type: "fail",
                        message: "User not found",
                        data: null,
                    });
                }
            } else {
                return res.status(400).json({
                    type: "fail",
                    message: "Invalid payload. Missing PaidBy user.",
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
                            let paidByGroupUser = groupDetail.groupMembers.find(member => member.user._id.toString() == paidBy);
                            for (let i = 0; i < expenseDetailPayload.length; i++) {
                                const share = expenseDetailPayload[i];

                                //Skip payer's own expense record.
                                if (share.paidFor == paidBy) {
                                    continue;
                                }

                                let friend1 = paidByUser.friends.find(f => f.user._id.toString() == share.paidFor);
                                friend1.amount = friend1.amount + share.amount;

                                paidByGroupUser.amount = paidByGroupUser.amount + share.amount;


                                let paidForUser = await getFriendsListByUserId(share.paidFor);
                                let friend2 = paidForUser.friends.find(f => f.user._id.toString() == paidBy);
                                friend2.amount = friend2.amount - share.amount;

                                let paidForGroupUser = groupDetail.groupMembers.find(member => member.user._id.toString() == share.paidFor);
                                paidForGroupUser.amount = paidForGroupUser.amount - share.amount;

                                paidForUser.save();
                            }
                            paidByUser.save();
                            groupDetail.save();
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
}

module.exports = ExpenseController