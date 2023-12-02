const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const groupSchema = new Schema({
    groupName: { type: Schema.Types.String, require: true },
    groupIcon: { type: Schema.Types.String },
    groupMembers: {
        type: [
            {
                user: { type: Schema.Types.ObjectId, ref: "User", required: true },
                amount: { type: Schema.Types.Number, default: 0 }
            }
        ],
        require: true
    },
    createdDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = model("Group", groupSchema);