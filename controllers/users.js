const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (req, res) => {
  const { username, name, password } = req.body;

  if (!password || password.length < 4) {
    return res.status(400).json({
      error:
        "The password is required and must be at least four characters long",
    });
  }

  // Hash the password with a cost factor of 10 using bcrypt
  const passwordHash = await bcrypt.hash(password, 10);
  // Create a new User instance with provided data
  const newUser = new User({
    username,
    name,
    passwordHash,
  });
  // Save the new user to the database
  const savedUser = await newUser.save();
  // Respond with a success status and the newly created user
  res.status(201).json(savedUser);
});

// GET route handler to retrieve all users
usersRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("playlists", {
    name: 1,
    creator: 1,
    numOfSongs: 1,
    likes: 1,
  });
  res.json(users);
});

module.exports = usersRouter;
