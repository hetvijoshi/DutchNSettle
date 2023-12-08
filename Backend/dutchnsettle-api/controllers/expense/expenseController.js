const { default: mongoose } = require("mongoose");
const { addExpense, addExpenseDetails, getUserBalance, getExpense, getExpenseOverview, getExpenseDetail } = require("../../services/expense/expenseService");
const { updateGroup } = require("../../services/group/groupService");
const { getFriendsListByUserId } = require("../../services/user/friendsService");
const { getUserDetailsById } = require("../../services/user/userService");
const { Friends, ExpenseDetail, Expense } = require("../../models");
const { SPLIT_TYPE } = require("../../utils/enums");

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
                                paidBy: expense.paidBy,
                                paidFor: new mongoose.Types.ObjectId(share.paidFor),
                                amount: parseFloat(share.amount.toFixed(2)),
                                splitType: share.splitType
                            };
                        });

                        let expenseDetails = await addExpenseDetails(expenseDetailPayload);
                        if (expenseDetails) {
                            let paidByUser = await getFriendsListByUserId(paidBy);
                            expenseDetailPayload.forEach(async (share) => {
                                if (share.paidFor.toString() != paidBy) {
                                    let friend1 = {};
                                    if (paidByUser && paidByUser.friends && paidByUser.friends.length > 0) {
                                        friend1 = paidByUser.friends.find(f => f.user._id.toString() == share.paidFor.toString());
                                        if (friend1 == undefined) {
                                            paidByUser.friends = [...paidByUser.friends, { user: share.paidFor, amount: 0 }]
                                        }
                                    } else {
                                        paidByUser = new Friends();
                                        paidByUser.user = new mongoose.Types.ObjectId(paidBy);
                                        paidByUser.friends = [{ user: share.paidFor, amount: 0 }]
                                    }

                                    friend1 = paidByUser.friends.find(f => f.user._id.toString() == share.paidFor.toString());
                                    friend1.amount = friend1.amount + share.amount;

                                    let paidForUser = await getFriendsListByUserId(share.paidFor.toString());
                                    if (paidForUser && paidForUser.friends && paidForUser.friends.length > 0) {
                                        friend1 = paidForUser.friends.find(f => f.user._id.toString() == share.paidBy.toString());
                                        if (friend1 == undefined) {
                                            paidForUser.friends = [...paidForUser.friends, { user: share.paidBy, amount: 0 }]
                                        }
                                    } else {
                                        paidForUser = new Friends();
                                        paidForUser.user = share.paidFor;
                                        paidForUser.friends = [{ user: share.paidBy, amount: 0 }]
                                    }

                                    let friend2 = paidForUser.friends.find(f => f.user._id.toString() == share.paidBy.toString());
                                    friend2.amount = friend2.amount - share.amount;
                                    paidForUser.save();
                                }

                            })
                            paidByUser.save();
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
                                paidBy: expense.paidBy,
                                paidFor: new mongoose.Types.ObjectId(share.paidFor),
                                amount: parseFloat(share.amount.toFixed(2)),
                                splitType: share.splitType
                            };
                        });

                        let expenseDetails = await addExpenseDetails(expenseDetailPayload);
                        if (expenseDetails) {
                            let paidByUser = await getFriendsListByUserId(paidBy);
                            //let paidByGroupUser = groupDetail.groupMembers.find(member => member.user._id.toString() == paidBy);
                            for (let i = 0; i < expenseDetailPayload.length; i++) {
                                const share = expenseDetailPayload[i];

                                //Skip payer's own expense record.
                                if (share.paidFor.toString() == paidBy) {
                                    continue;
                                }

                                let friend1 = paidByUser.friends.find(f => f.user._id.toString() == share.paidFor.toString());
                                friend1.amount = friend1.amount + share.amount;

                                if (friend1.groups && friend1.groups.length > 0) {
                                    let group1 = friend1.groups.find(g => g.groupId.toString() == groupId);
                                    if (group1 != null) {
                                        group1.amount = group1.amount + share.amount;
                                    } else {
                                        friend1.groups = [...friend1.groups, { groupId: new mongoose.Types.ObjectId(groupId), amount: share.amount }]
                                    }

                                } else {
                                    friend1.groups = [{ groupId: new mongoose.Types.ObjectId(groupId), amount: share.amount }]
                                }


                                //paidByGroupUser.amount = paidByGroupUser.amount + share.amount;


                                let paidForUser = await getFriendsListByUserId(share.paidFor);
                                let friend2 = paidForUser.friends.find(f => f.user._id.toString() == paidBy);
                                friend2.amount = friend2.amount - share.amount;

                                if (friend2.groups && friend2.groups.length > 0) {
                                    let group2 = friend2.groups.find(g => g.groupId.toString() == groupId);
                                    if (group2 != null) {
                                        group2.amount = group2.amount - share.amount;
                                    } else {
                                        friend2.groups = [...friend2.groups, { groupId: new mongoose.Types.ObjectId(groupId), amount: -1 * share.amount }]
                                    }

                                } else {
                                    friend2.groups = [{ groupId: new mongoose.Types.ObjectId(groupId), amount: -1 * share.amount }]
                                }

                                //let paidForGroupUser = groupDetail.groupMembers.find(member => member.user._id.toString() == share.paidFor);
                                //paidForGroupUser.amount = paidForGroupUser.amount - share.amount;

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

    static async fetchUserExpense(req, res) {
        try {
            const userId = req.params.id;
            const friendId = req.params.friendId;
            let expenses = await getUserBalance(userId);
            let ids = new Set()

            expenses.filter(expense => {
                return ((expense.paidFor._id.toString() == friendId) && expense.expenseId.paidBy._id.toString() == userId)
                    || (expense.paidFor._id.toString() == userId && expense.expenseId.paidBy._id.toString() == friendId)
            }).map(expense => ids.add(expense.expenseId._id));

            expenses = expenses.filter(expense => ids.has(expense.expenseId._id));

            let expenseDetails = [];
            expenses.forEach(expense => {
                let e = expenseDetails.findIndex(detail => detail.expenseSummary._id == expense.expenseId._id);
                if (e >= 0) {
                    expenseDetails = expenseDetails.map(detail => {
                        if (detail.expenseSummary._id == expense.expenseId._id) {
                            let arr = detail.expenseDetail;
                            arr = [...arr, expense]
                            detail = { ...detail, expenseDetail: arr }
                        }
                        return detail;
                    });
                } else {
                    let d = {
                        expenseSummary: expense.expenseId,
                        expenseDetail: [expense]
                    }
                    expenseDetails.push(d);
                }
            })

            if (expenses) {
                return res.status(200).json({
                    type: "success",
                    message: "Success result",
                    data: expenseDetails,
                });
            } else {
                return res.status(200).json({
                    type: "success",
                    message: "No expenses found",
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

    static async fetchGroupExpense(req, res) {
        try {
            const groupId = req.params.groupId;
            let expenses = await getExpenseOverview(groupId);
            let expenseIds = []
            let expenseDetails = []
            expenses.map(expense => {
                expenseIds.push(expense._id)
            })
            if (expenseIds.length > 0) {
                let expensesDetail = await getExpenseDetail(expenseIds)
                expenseIds.map(expId => {
                    const exp = expenses.find(e => e._id.toString() == expId)
                    const filteredExpenses = expensesDetail.filter(e => e.expenseId._id.toString() == expId)
                    expenseDetails.push({ expenseSummary: exp, expenseDetail: filteredExpenses })
                })
            }


            return res.status(200).json({
                type: "success",
                message: "No expenses found",
                data: expenseDetails,
            });
        }
        catch (error) {
            console.log(error);
        }
    }


    static async settleExpense(req, res) {
        try {
            const { payerId, creditorId, amount, expenseName, expenseDate } = req.body;

            let settleExpense = new Expense();
            settleExpense.paidBy = new mongoose.Types.ObjectId(payerId);
            settleExpense.expenseAmount = amount;
            settleExpense.expenseName = expenseName;
            settleExpense.groupId = undefined;
            settleExpense.expenseDate = new Date(expenseDate).toISOString();
            settleExpense.save();

            let settleExpenseDetail = new ExpenseDetail();
            settleExpenseDetail.expenseId = settleExpense._id;
            settleExpenseDetail.paidBy = new mongoose.Types.ObjectId(payerId);
            settleExpenseDetail.paidFor = new mongoose.Types.ObjectId(creditorId);
            settleExpenseDetail.splitType = SPLIT_TYPE.SETTLED;
            settleExpenseDetail.amount = amount;
            settleExpenseDetail.save();

            let payer = await getFriendsListByUserId(payerId);
            if (payer && payer.friends && payer.friends.length > 0) {
                let friend1 = payer.friends.find(f => f.user._id.toString() == creditorId);
                if (friend1 != undefined) {
                    friend1.amount = friend1.amount + amount;
                    payer.save();
                } else {
                    return res.status(500).json({
                        type: "fail",
                        message: "Something went wrong while settling amount.",
                        data: null,
                    });
                }
            } else {
                return res.status(500).json({
                    type: "fail",
                    message: "Something went wrong while settling amount.",
                    data: null,
                });
            }

            let creditor = await getFriendsListByUserId(creditorId);
            if (creditor && creditor.friends && creditor.friends.length > 0) {
                let friend1 = creditor.friends.find(f => f.user._id.toString() == payerId);
                if (friend1 != undefined) {
                    friend1.amount = friend1.amount - amount;
                    creditor.save();
                } else {
                    return res.status(500).json({
                        type: "fail",
                        message: "Something went wrong while settling amount.",
                        data: null,
                    });
                }
            } else {
                return res.status(500).json({
                    type: "fail",
                    message: "Something went wrong while settling amount.",
                    data: null,
                });
            }

            return res.status(200).json({
                type: "success",
                message: "Expense settled up.",
                data: null,
            });
        } catch (error) {
            return res.status(500).json({
                type: "error",
                message: error.message || "Unhandled Error",
                error,
            });
        }
    }

    static async settleGroupExpense(req, res) {
        try {
            const { payerId, creditorId, amount, groupId, expenseName, expenseDate } = req.body;

            let settleExpense = new Expense();
            settleExpense.paidBy = new mongoose.Types.ObjectId(payerId);
            settleExpense.expenseAmount = amount;
            settleExpense.expenseName = expenseName;
            settleExpense.groupId = groupId;
            settleExpense.expenseDate = new Date(expenseDate).toISOString();
            settleExpense = settleExpense.save();

            let settleExpenseDetail = new ExpenseDetail();
            settleExpenseDetail.expenseId = settleExpense._id;
            settleExpenseDetail.groupId = groupId;
            settleExpenseDetail.paidBy = new mongoose.Types.ObjectId(payerId);
            settleExpenseDetail.paidFor = new mongoose.Types.ObjectId(creditor);
            settleExpenseDetail.splitType = SPLIT_TYPE.SETTLED;
            settleExpenseDetail.amount = amount;
            settleExpenseDetail.save();

            let payer = await getFriendsListByUserId(payerId);
            if (creditorcreditor && creditor.friends && creditor.friends.length > 0) {
                let friend1 = creditor.friends.find(f => f.user._id.toString() == creditorId);
                let group1 = friend1.groups.find(g => g.groupId.toString() == groupId);
                if (friend1 != undefined && group1) {
                    friend1.amount = friend1.amount + amount;
                    group1.amount = group1.amount + amount;
                    payer.save();
                } else {
                    return res.status(500).json({
                        type: "fail",
                        message: "Something went wrong while settling amount.",
                        data: null,
                    });
                }
            } else {
                return res.status(500).json({
                    type: "fail",
                    message: "Something went wrong while settling amount.",
                    data: null,
                });
            }

            let creditor = await getFriendsListByUserId(creditorId);
            if (creditor && creditor.friends && creditor.friends.length > 0) {
                let friend1 = creditor.friends.find(f => f.user._id.toString() == payerId);
                let group2 = friend1.groups.find(g => g.groupId.toString() == groupId);
                if (friend1 && group2) {
                    friend1.amount = friend1.amount - amount;
                    group2.amount = group2.amount - amount;
                    creditor.save();
                } else {
                    return res.status(500).json({
                        type: "fail",
                        message: "Something went wrong while settling amount.",
                        data: null,
                    });
                }
            } else {
                return res.status(500).json({
                    type: "fail",
                    message: "Something went wrong while settling amount.",
                    data: null,
                });
            }

            return res.status(200).json({
                type: "success",
                message: "Expense settled up.",
                data: null,
            });
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