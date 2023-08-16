const express = require("express");
const app = express();
require("express-async-errors");
const cors = require("cors");
const mongoose = require("mongoose");
const middleware = require("./utils/middleware");

const logger = require("./utils/logger");
const config = require("./utils/config");

const playlistsRouter = require("./controllers/playlists");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

mongoose.set("strictQuery", false);
mongoose
  .connect(config.dbUrl)
  .then(() => logger.info("DB connection established"))
  .catch(() => logger.error("Error connecting to database"));

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenPayloadExtractor);
app.use(middleware.userIdentifier);
app.use("/api/playlists", playlistsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
