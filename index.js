const express = require("express");
const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/tabulate")
// startup

//logging 
// require("./startup/logging")()
require("./startup/env")()


//routers 

const userRouter = require("./server/api/routes/users")

const app = express()

app.use(express.json())

app.use("/users", userRouter)



PORT = 3000
app.listen(PORT, () => console.log("Server is listening on port: " + PORT))