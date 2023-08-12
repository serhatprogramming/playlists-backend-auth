const logger = require("./logger");

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
  }
  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

module.exports = { errorHandler, requestLogger, unknownEndpoint };
