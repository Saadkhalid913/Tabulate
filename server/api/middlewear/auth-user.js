const jwt = require("jsonwebtoken");
const express = require("express")
const config = require("config")

async function AuthUserFromBody(req, res, next) {
  const key = config.get("tokenPrivKey")

  let token = req.body.user_auth_token
  if (!token) return res.status(401).send({ error: "No token provided" });
  try {
    const decoded = await jwt.verify(token, key)
    req._user = decoded
    next()
  }
  catch (err) {
    res.status(401).send({ error: "Invalid credentials", log: err })
  }
}


module.exports = AuthUserFromBody