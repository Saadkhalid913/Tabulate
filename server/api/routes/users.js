const express = require("express");
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const _ = require("lodash")
const userModel = require("../models/models").userModel
const jwt = require("jsonwebtoken")
const config = require("config")



const router = express.Router()



router.post("/signup", async (req, res) => {
  const first_name = req.body.first_name
  const last_name = req.body.last_name
  const email = req.body.email
  let password = req.body.password

  let check = await userModel.findOne({ email: email })
  if (check) return res.status(301).send({ error: "User already registered" })

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt)

  const user = new userModel({ first_name, last_name, email, password })
  const response = await user.save()

  res.status(200).send({ ..._.pick(response, ["_id", "email"]), "auth-token": user.generateAuthToken() })
})

router.post("/login", async (req, res) => {
  const email = req.body.email
  const password = req.body.password;

  const user = await userModel.findOne({ email: email })


  if (!user) return res.status(400).send("No such user")

  const valid = await bcrypt.compare(password, user.password)

  if (!valid) return res.status(400).send("Invalid login")

  if (valid) return res.status(200).send({ ..._.pick(user, ["_id", "email"]), "auth-token": user.generateAuthToken() })
})

module.exports = router