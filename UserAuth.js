const jwt = require("jsonwebtoken")
const userSchema = require("../Modules/User.js");
const userAuth = ((req, res, next) => {
  try {
  const token = jwt.verify(req.cookies.token, "aashu@2000");
  if(!token.ok) {
    throw new Error ("Token not found")
  }
  const {id} = token;
  const loggedInUser = userSchema.findById(id);
  req.user = loggedInUser;
  next()
  } catch (error) {
    res.json({error})
  }
})