const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const friendsSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", require: true },
    friends: [
        {
            user: { type: Schema.Types.ObjectId, ref: "User", require: true },
            amount: { type: Schema.Types.Number, default: 0 }
        }
    ],
});

module.exports = model("Friends", friendsSchema);