const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: { type: String, require: true, unique: true },
  name: { type: String, require: true },
  firstName: { type: String, require: true },
  lastName: String,
  picture: String,
  createdDate: { type: Date, default: Date.now },
  modifiedDate: { type: Date, default: Date.now },
  phone: Schema.Types.Number
});

module.exports = model("User", userSchema);