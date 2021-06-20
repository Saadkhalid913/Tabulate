const express = require("express");
const mongoose = require("mongoose")
const upload = require("express-fileupload")
const cors = require("cors")
const bodyParser = require("body-parser")


mongoose.connect("mongodb://localhost:27017/tabulate", { useNewUrlParser: true, useUnifiedTopology: true })
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




PORT = 3000
app.listen(PORT, () => console.log("Server is listening on port: " + PORT))