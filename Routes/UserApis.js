const express = require("express");
const userSchema = require("../Modules/Users.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userAuth = require("../Middlewares/UserAuth.js");

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  const {name, emailId, password} = req.body;
  try {
    const userDetails = new userSchema({
      name, 
      emailId,
      password
    });
    await userDetails.save()
    if(!userDetails) {
      throw new Error ("User not saved")
    }
    res.json({
      message: "User saved succesfully"
    })
  } catch (error) {
    res.json({
      error: error.message
    })
  }
})


userRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    const isUser = await userSchema.findOne({ emailId });

    if (!isUser) {
      return res.json({ message: "No user found" });
    }

    if (!password) {
      return res.json({ message: "Please enter password" });
    }
    if (isUser.password === password) {
      
    const token = jwt.sign({id: isUser._id}, "aashu@2000", {expiresIn: "1h"})
    res.cookie("token", token)
      return res.json({ 
        message: "user loggedIn",
        User: isUser,

      });
    } else {
      return res.json({ message: "Password not matched" });
    }
    
    
  } catch (error) {
    res.json({ error: error.message });
  }
});

userRouter.get("/users", userAuth, async (req, res) => {
  const loggedInUser = req.user;
  try {
    await new Promise(resolve => 
      setTimeout(resolve, 2000))
    const users = await userSchema.find()
    ;
    console.log(loggedInUser._id)
const getUsers = users.filter(user => user._id.toString() !== loggedInUser._id.toString())
    if(getUsers.length === 0) {
      throw new  Error ("No user found")
    }
    res.json({
     accountUser: loggedInUser,
     users: getUsers
    })
  } catch (error) {
    res.status(400).json({error: error.message})
  }
})

userRouter.get("/chat/:id", userAuth, async (req, res)=> {
  const {id} = req.params;
  try {
    const user = await userSchema.findById(id)
    if(!user) {
      throw new Error ("user not found")
    }
    res.json({
     user
    })
  } catch (error) {
    res.json({error: error.message})
  }
})

userRouter.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({message: "loggedout sucessfully"})
  } catch (error) {
    res.json({error: error.message})
  }
})

module.exports = userRouter;