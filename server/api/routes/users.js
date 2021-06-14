const express = require("express");
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const userModel = require("../models/models").userModel
const jwt = require("jsonwebtoken")
const config = require("config")



const router = express.Router()


router.post("/signup", async (req, res) => {
  const first_name = req.body.first_name
  const last_name = req.body.last_name
  const email = req.body.email
  let password = req.body.password

  // let check = await userModel.findOne({ email: email })
  // if (check) return res.status(301).send({ error: "User already registered" })

  const user = new userModel({ first_name, last_name, email, password })
  const response = await user.save();
  console.log(await jwt.verify(user.generateAuthToken(), config.get("tokenPrivKey")))


})

module.exports = router