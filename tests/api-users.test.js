const User = require("../models/user");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({}); // Clear all users from the database
  const passwordHash = await bcrypt.hash("password", 10); // hash password
  const user = new User({
    username: "testuser",
    name: "Test User",
    passwordHash,
  });

  await user.save(); // Add a test user
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("/api/users", () => {
  test("succeeds with valid data", async () => {
    const newUser = {
      username: "newuser",
      name: "New User",
      password: "testpassword",
    };

    const response = await api.post("/api/users").send(newUser).expect(201);

    const usersInDb = await User.find({});
    expect(usersInDb).toHaveLength(2);
    expect(response.body.username).toBe(newUser.username);
  });

  test("username is required", async () => {
    const newUser = {
      name: "New User",
      password: "testpassword",
    };

    const response = await api.post("/api/users").send(newUser).expect(400);

    expect(response.body.error).toContain("username");
  });

  test("usernames must be unique", async () => {
    const newUser = {
      username: "testuser",
      name: "New User",
      password: "testpassword",
    };

    // Create the same user as in DB initially
    const response = await api.post("/api/users").send(newUser).expect(400);

    expect(response.body.error).toContain("unique");
  });

  test("passwords must be required and at least four characters long", async () => {
    const newUserNoPassword = {
      username: "testuser1",
      name: "New User",
    };

    const newUserShortPassword = {
      username: "testuser2",
      name: "New User",
      password: "123", // Password less than four characters
    };

    // Attempt to create a user without a password
    const responseNoPassword = await api
      .post("/api/users")
      .send(newUserNoPassword)
      .expect(400);

    // Attempt to create a user with a password less than four characters
    const responseShortPassword = await api
      .post("/api/users")
      .send(newUserShortPassword)
      .expect(400);

    expect(responseNoPassword.body.error).toContain("password");
    expect(responseShortPassword.body.error).toContain("password");
  });
});
