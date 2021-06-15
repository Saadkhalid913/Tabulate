const mongoose = require("mongoose")
const config = require("config")
const jwt = require("jsonwebtoken")

const emailValidationPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true, minlength: 2, maxlength: 64 },
  last_name: { type: String, required: true, minlength: 2, maxlength: 64 },
  email: {
    type: String, required: true, minlength: 3, unique: false, maxlength: 255,
    match: emailValidationPattern
  },
  password: { type: String, maxlength: 512 },
  signup_date: { type: Date, default: new Date() },
  posts: { type: [mongoose.Schema.Types.ObjectId] }
})

userSchema.methods.generateAuthToken = function () {
  const priv_key = config.get("tokenPrivKey")
  const token = jwt.sign({ _id: this._id }, priv_key)
  return token
}


module.exports = userSchema