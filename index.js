console.log("App is starting......")
const express = require("express");
const mongoose = require("mongoose")
const upload = require("express-fileupload")
const cors = require("cors")
const bodyParser = require("body-parser")
const config = require("config")
const fs = require("fs");
const path = require("path")

if (!fs.existsSync(path.join(__dirname, "/server/assets")))
  fs.mkdirSync(path.join(__dirname, "/server/assets"))

const URI = config.get("URI")

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
// startup

//logging 
// require("./startup/logging")()
require("./startup/env")()


//routers 

const userRouter = require("./server/api/routes/users")
const postRouter = require("./server/api/routes/posts")

const views = require("./server/api/routes/views")

const app = express()

app.use(cors({ origin: "*" }))
app.use(express.json())
app.use(upload())
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", views)
app.use("/api/users", userRouter)
app.use("/api/posts", postRouter)




PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log("Server is listening on port: " + PORT))