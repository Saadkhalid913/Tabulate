const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const _ = require("lodash")

const userSchema = require("./UserSchema")
const postSchema = require("./postSchema")


const userModel = mongoose.model("Users", userSchema);
const postModel = mongoose.model("Posts", postSchema)


module.exports.userModel = userModel
module.exports.postModel = postModel
