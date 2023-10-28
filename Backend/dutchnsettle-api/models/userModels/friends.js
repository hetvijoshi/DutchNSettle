const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const friendsSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", require: true },
    friends: [
        {
            userId: { type: Schema.Types.ObjectId, ref: "User", require: true }
        }
    ],
});

module.exports = model("Friends", friendsSchema);