const mongoose = require("mongoose");
const { SPLIT_TYPE } = require("../../utils/enums");
const { Schema, model } = mongoose;

const expenseDetailSchema = new Schema({
    expenseId: { type: Schema.Types.ObjectId, ref: "Expense", require: true },
    paidBy: { type: Schema.Types.ObjectId, ref: "User", require: true },
    paidFor: { type: Schema.Types.ObjectId, ref: "User", require: true },
    amount: { type: Schema.Types.Number, require: true },
    splitType: { type: Schema.Types.String, enum: Object.keys(SPLIT_TYPE), require: true },
    createdDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now }
});

module.exports = model("ExpenseDetail", expenseDetailSchema);