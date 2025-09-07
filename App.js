const express = require("express");
const connectDb = require("./Database/Database.js")
const userRouter = require("./Routes/UserApis.js");
const cors = require("cors");
const http = require("http");
const cookieParser = require("cookie-parser")

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
app.use(cookieParser())
app.use(express.json())

app.use("/", userRouter)
const server = http.createServer(app);
const startSocket = require("./Utils/Socket.js");

startSocket(server)
connectDb().then(() => {
console.log("Database connected succesfully")
server.listen(5491, () => {
  console.log("Server is listening on port 8000...")
})
  
})
