const express = require("express");
const jwt = require("jsonwebtoken")
const userSchema = require("../Models/Usermodel.js");
const bcrypt = require("bcryptjs");
const taskSchema = require("../Models/Models.js");
const userAuthentication = require("../Middlewares/UserAuthentication.js")
const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  const {name, email, password} = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new userSchema({
      name,
      email,
      password: hashedPassword
    })
    await user.save()
    if(!user) {
      throw new Error("User not saved")
    }
    res.json({
      Message: "User saved sucessfully",
      user
    })
  } catch (error) {
    res.status(400).json({error: error.message})
  }
})

userRouter.post("/login", async (req, res) => {
  const {email, password} = req.body;
  try {
    const isUser = await userSchema.findOne({email: email})
    if(!isUser) {
      throw new Error("Invaild email")
    }
    const passwordMatched = await bcrypt.compare(password, isUser.password)
    if(!passwordMatched) {
      throw new Error("Invalid password not matched")
    }
    const token = jwt.sign({id: isUser._id}, "aashu@2000", {expiresIn: "1h"})
  res.cookie("token", token, {
  httpOnly: true, // ✅ protect from XSS
  secure: false,  // ❌ use true in production (HTTPS)
  sameSite: "Lax" // ✅ allow cross-origin if needed
});
    res.json({Message: "User logged in sucessfully",
    userToken: token
    })
    
  } catch (error) {
    res.status(400).json({error: error.message})
  }
})
userRouter.delete("/delete-account", userAuthentication, async (req, res) => {
  const {id} = req.user;
  try {
   const userAndTask = await taskSchema.deleteMany({user: id})
   
   const userAccount = await userSchema.findByIdAndDelete(id)
   if(userAndTask && userAccount) {
     res.json({message: "Your account has been deleted",
     userAndTask, 
     userAccount})
   }
   
  } catch (error) {
    res.status(400).json({error: error})
  }
})
userRouter.patch("/update-password", userAuthentication, async (req, res) => {
  const loggedInUser = req.user;
  const {previousPassword, newPassword} = req.body;
  try {
    const isPasswordSame = await bcrypt.compare(previousPassword, loggedInUser.password)
    if(!isPasswordSame) {
      throw new Error ("Enter a vaild password")
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    const passwordUpdated = await userSchema.findOneAndUpdate({_id: loggedInUser.id}, {password: hashedPassword}, {new: true})
    res.json({message: "password updated sucessfully", passwordUpdated})
  } catch (error) {
    res.json({error: error.message})
  }
  
})
userRouter.get("/alluser", userAuthentication, async (req, res) => {
  const loggedInUser = req.user;
  res.json({User:
  loggedInUser
})
})
module.exports = userRouter;
