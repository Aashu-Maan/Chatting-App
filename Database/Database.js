const mongoose = require ("mongoose");
const url = "mongodb+srv://aashumaan:9alIssTCYZbjdWNa@cluster0.w3wy0.mongodb.net/chat";

async function connectDb() {
  try {
    const isConnected = await mongoose.connect(url);
    if(!isConnected) {
      throw new Error("Database could not be connected");
    }
  } catch (error) {
    console.log("Error: " + error)
  }
}
module.exports = connectDb