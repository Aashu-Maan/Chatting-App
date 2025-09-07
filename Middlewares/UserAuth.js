const jwt = require("jsonwebtoken")
const userSchema = require("../Modules/Users.js");
const userAuth = async (req, res, next) => {
  try {
  const token = jwt.verify(req.cookies.token, "aashu@2000");
  if(!token) {
    throw new Error ("Token not found")
  }
  const {id} = token;
  const loggedInUser = await userSchema.findById(id);
  req.user = loggedInUser;
  next()
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

module.exports = userAuth;