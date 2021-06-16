const express = require("express");
const mongoose = require("mongoose")
const upload = require("express-fileupload")

mongoose.connect("mongodb://localhost:27017/tabulate")
// startup

//logging 
// require("./startup/logging")()
require("./startup/env")()


//routers 

const userRouter = require("./server/api/routes/users")
const postRouter = require("./server/api/routes/posts")

const app = express()

app.use(express.json())
upp.use(upload())

app.use("/users", userRouter)
app.use("/posts", postRouter)



PORT = 3000
app.listen(PORT, () => console.log("Server is listening on port: " + PORT))