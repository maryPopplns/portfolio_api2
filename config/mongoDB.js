require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const { logger } = require(path.join(__dirname, './logger.js'));

mongoose
  .connect(process.env.ATLAS_DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => logger.info(`DB connection successful 🔓`))
  .catch((error) => logger.info(`${error}`));
