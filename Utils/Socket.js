/*
const socket = require("socket.io");


const startSocket = (server) => {
  
const io = socket(server, {
  cors: {
    origin: "http://localhost:5173",
  },
})
io.on("connection", (socket) => {
  socket.on("joinChat", () => {
    
  })
})
}
module.exports = startSocket; 

*/

const { Server } = require("socket.io");
const userSchema = require("../Modules/Users.js");
const startSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);
    
   socket.on("user-online", async (data) => {
     const userId = data.User._id;
     console.log(data.User.name + " logged in")
     
     await userSchema.findByIdAndUpdate(userId, {status: "online"})
     
     
     const userName = data.User.name;
     const status = data.User.status = "online";
     console.log(userName + ": " + status)
     io.emit("update-online", {userId, status})
     
   });
   
  socket.on("user-logout", async (data) => {
    const userId = data._id;
    const userName = data.name;
    const statusOffline = "offline";
    const userStatus = await userSchema.findByIdAndUpdate(userId, {status: statusOffline}, {new: true})
    console.log(userName + " loggedOut")
    io.emit("update-offline", {userId, statusOffline})
    
  })
  
    socket.on("joinChat", ({ firstName, loggedInUser, id }) => {
      const roomId = [loggedInUser, id].sort().join("_")
      console.log(firstName + " Joined-room: " + roomId)
      socket.join(roomId);
    });

    socket.on("sendMessage", ({
    firstName,
    loggedInUser,
    id,
    text
    }) => {
    const roomId = [loggedInUser, id].sort().join("_");
    console.log(firstName + " " + text)
    io.to(roomId).emit("messageReceived", {firstName, text, loggedInUser})
    })
  });
  
  
};

module.exports = startSocket;

/*
const { Server } = require("socket.io");

const startSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    socket.on("joinChat", ({ firstName, senderId, id }) => {
      const roomId = [senderId, id].sort().join("_")
      console.log(firstName + " Joined-room: " + roomId)
      socket.join(roomId)
    });

    socket.on("sendMessage", ({ firstName, senderId, id, text }) => {
      const roomId = [senderId, id].sort().join("_")
      console.log(firstName + " " + text)
      io.to(roomId).emit("messageReceived", { firstName, text, senderId })
    })
  });
};

module.exports = startSocket;
*/