const express = require("express");
const path = require("path")
const router = express.Router();

const viewPath = path.join(__dirname + "../" + "../" + "../", "../" + "/client/src/")


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


// CSS 
router.get("/css/main.css", (req, res) => {
  res.sendFile(viewPath + "css/main.css")
})
router.get("/css/navbar.css", (req, res) => {
  res.sendFile(viewPath + "css/navbar.css")
})

// SCRIPTS 


module.exports = router