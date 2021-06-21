const express = require("express");
const path = require("path")
const router = express.Router();
const auth = require("../middlewear/auth-user")
const userModel = require("../models/models").userModel

const viewPath = path.join(__dirname + "../" + "../" + "../", "../" + "/client/src/")
const staticPath = path.join(__dirname + "../" + "../" + "../", "../" + "/client/public/")


// HTML 
router.get("/", (req, res) => {
  res.sendFile(viewPath + "Homepage.html")
})

router.get("/signup", (req, res) => {
  res.sendFile(viewPath + "signup.html")
})
router.get("/login", (req, res) => {
  res.sendFile(viewPath + "login.html")
})
router.get("/index", (req, res) => {
  res.sendFile(viewPath + "index.html")
})

router.get("/dashboard/:id", (req, res) => {
  res.sendFile(viewPath + "dashboard.html")
})

router.post("/dashboard", auth, async (req, res) => {
  const id = req._user._id;
  const user = await userModel.findById(id)
  if (!user) return res.status(401).redirect("/")
  res.redirect("/dashboard/" + id)
})


// CSS 
router.get("/css/:filename", (req, res) => {
  res.sendFile(viewPath + "css/" + req.params.filename)
})


// SCRIPTS 

router.get("/js/:filename", (req, res) => {
  res.sendFile(viewPath + "js/" + req.params.filename)
})


// STATIC

router.get("/public/:filename", (req, res) => res.sendFile(staticPath + req.params.filename))

module.exports = router