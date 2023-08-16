const logger = require("./logger");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const requestLogger = (req, res, next) => {
  logger.info(`Request Method: ${req.method}`);
  logger.info(`Request Path: ${req.path}`);
  Object.keys(req.body).length !== 0 && logger.info(`Request Body:`, req.body);
  logger.info("--------------------------------");
  next();
};

const errorHandler = (error, request, response, next) => {
  logger.error("error message:", error.message);
  if (error.name === "CastError") {
    return response.status(400).json({ error: "invalid id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: error.message });
  }
  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const tokenPayloadExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
  } else {
    request.token = null;
  }
  next();
};

const userIdentifier = async (request, response, next) => {
  if (request.token) {
    const decodedToken = jwt.verify(request.token, process.env.PRIVATE_KEY);
    const retrievedUser = await User.findById(decodedToken.id);
    request.user = retrievedUser;
  }

  next();
};

module.exports = {
  errorHandler,
  requestLogger,
  unknownEndpoint,
  tokenPayloadExtractor,
  userIdentifier,
};
