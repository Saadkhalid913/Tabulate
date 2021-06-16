const mongoose = require("mongoose")
const config = require("config")
const userSchema = require("./UserSchema")

const postSchema = new mongoose.Schema({
  title: { type: String, minlength: 8, maxlength: 512, required: true, },
  author: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "User",
    minlength: 1,
    required: true
  },
  // files: {type: [String], required: false}
  tags: { type: [String] }
})

module.exports = postSchema;
