const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const groupSchema = new Schema({
    groupName: { type: Schema.Types.String, require: true },
    groupIcon: { type: Schema.Types.String },
    groupMembers: {
        type: [
            {
                userId: { type: Schema.Types.ObjectId, ref: "User", required: true }
            }
        ],
        require: true,
        validate: [(val) => { return val.length >= 2; }, 'Group should have atleast 2 members other than creator.']
    },
});

module.exports = model("Group", groupSchema);