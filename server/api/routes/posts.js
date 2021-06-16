const express = require("express");
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const _ = require("lodash")
const jwt = require("jsonwebtoken")
const config = require("config")
const auth = require("../middlewear/auth-user")


// schemas 
const userModel = require("../models/models").userModel
const postModel = require("../models/models").postModel

const router = express.Router();

router.post("/upload", auth, async (req, res) => {
  const author = [req._user._id];
  const title = req.body.post.title;

  if (!title) return res.status(400).send({ error: "No title provided" })

  const post = new postModel({ title, author })
  console.log(post)
  try {
    const response = await post.save()
    res.send(response)
  }
  catch (err) { return res.status(500).send({ error: "Internal server error", log: err }) }
})

router.get("/", async (req, res) => {
  const posts = await postModel.find();
  return res.send(posts);
})

router.put("/:id", auth, async (req, res) => {
  // getting id of post and user 
  const user_id = req._user._id;
  const post_id = req.params.id;

  // getting PUT info from body 
  const title = req.body.post.title
  const tags = req.body.post.tags

  if (!post_id) return res.status(301).send({ error: "No Id provided" })
  const post = await postModel.findById(post_id)
  if (!post) return res.send({ error: "Invalid Id" })

  if (!post.author.includes(user_id)) return res.status(301).send({ err: "User not authorized" })

  console.log(title, tags)
  console.log("__________________________________________________________________________")

  try {
    const response = await postModel.findByIdAndUpdate(post_id, { title, tags })
    res.send(response)
  }
  catch (err) {
    console.log(err)
    res.status(400).send({ error: "Server-side error", log: err })
  }
})


module.exports = router