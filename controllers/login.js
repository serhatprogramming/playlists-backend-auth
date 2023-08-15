const jwt = require("jsonwebtoken"); // JWT library for token handling
const bcrypt = require("bcrypt"); // Bcrypt library for password hashing
const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username }); // Find user in the database
  // Compare hashed password
  const passwordCheck =
    user !== null ? await bcrypt.compare(password, user.passwordHash) : false;
  // If user or password is invalid return error response
  if (!(user && passwordCheck)) {
    return response.status(401).json({
      error: "invalid credentials",
    });
  }
  // Prepare user information for token creation
  const userInfoForTokenCreation = {
    username: user.username,
    id: user._id,
  };
  // Create a signed token with user info and private key
  const token = jwt.sign(userInfoForTokenCreation, process.env.PRIVATE_KEY);

  // Send token and user info in response
  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
