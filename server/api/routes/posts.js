const express = require("express");
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const _ = require("lodash")
const jwt = require("jsonwebtoken")
const config = require("config")
const auth = require("../middlewear/auth-user")
const path = require("path")
const fs = require("fs")


// schemas 
const userModel = require("../models/models").userModel
const postModel = require("../models/models").postModel

const router = express.Router();

router.post("/upload", auth, async (req, res) => {
  const author = [req._user._id];
  const title = req.body.post.title;
  const tags = req.body.post.tags

  if (!title) return res.status(400).send({ error: "No title provided" })


  const post = new postModel({ title, author, tags })

  try {
    const response = await post.save()
    await userModel.findByIdAndUpdate(author, { $push: { posts: response._id } })
    res.send(response)
  }
  catch (err) {
    console.log(err)
    return res.status(500).send({ error: "Internal server error", log: err })
  }
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


  // checking if post id is valid and also checking if post exists 
  if (!post_id) return res.status(301).send({ error: "No Id provided" })
  const post = await postModel.findById(post_id)
  if (!post) return res.send({ error: "Invalid Id" })

  // checking if user is one of the authors 
  if (!post.author.includes(user_id)) return res.status(301).send({ err: "User not authorized" })


  try {
    const response = await postModel.findByIdAndUpdate(post_id, { title, tags })
    res.send(response)
  }
  catch (err) {

    res.status(400).send({ error: "Server-side error", log: err })
  }
})

router.post("/uploadfiles/:id", auth, async (req, res) => {


  if (!req.files) return res.status(400).send({ error: "No files provided" });
  assetPaths = []
  let files = [];

  for (let f in req.files) {
    files.push(req.files[f])
  }

  const assetsDir = path.join(__dirname, "../", "../", "/assets/")



  let id = req.params.id
  if (!id) return res.status(300).send({ error: "no id provided" });
  const post = await postModel.findById(id);
  if (!post) return res.status(300).send({ error: "no post by that id" });


  for (let file of files) {
    if (!file) continue
    postdir = assetsDir + `${id}`;

    if (!fs.existsSync(postdir))
      fs.mkdir(assetsDir + `${id}/`, (err) => { if (err) console.log(err) })

    try {
      file.mv(postdir + "/" + file.name)
      assetPaths.push(file.name)
      console.log("Moved File! ", id)
    }
    catch (err) {
      console.log(err)
    }
  }

  post.files = assetPaths;
  id = post._id

  try {
    const response = await post.save();
    const user = await userModel.findById(req._user._id);
    if (!user) console.log("No user")
    user.posts.push(id)
    return res.send(_.pick(response, ["_id", "author", "title", "files"]));
  }
  catch (err) {
    return res.status(500).send({ err: "Serverside error", log: err })
  }
})

router.get("/files/:postid/:filename", (req, res) => {
  const postid = req.params.postid;
  const filename = req.params.filename;
  const assetPath = path.join(__dirname, "../", "../", "/assets/");
  res.sendFile(assetPath + filename);
})




module.exports = router