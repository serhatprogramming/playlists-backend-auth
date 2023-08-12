require("dotenv").config();

const config = {
  dbUrl:
    process.env.NODE_ENV === "TEST_ENV"
      ? process.env.TEST_DB_URL
      : process.env.DB_URL,
  port: process.env.PORT || 3003,
};

module.exports = config;
