const mongoose = require("mongoose")
const emailValidationPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true, minlength: 2, maxlength: 64 },
  last_name: { type: String, required: true, minlength: 2, maxlength: 64 },
  email: {
    type: String, required: true, minlength: 3, unique: true, maxlength: 255,
    match: emailValidationPattern
  },
  password: { type: String, maxlength: 512 },
  signup_date: { type: Date, default: new Date() },
  posts: { type: [mongoose.Schema.Types.ObjectId] }
})

module.exports = userSchema