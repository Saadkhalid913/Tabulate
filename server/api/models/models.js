const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const _ = require("lodash")

const userSchema = require("./UserSchema")

// console.log(userSchema)

const userModel = mongoose.model("Users", userSchema);








module.exports.userModel = userModel
