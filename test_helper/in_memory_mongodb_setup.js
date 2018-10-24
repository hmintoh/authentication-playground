//set up in memory mongodb server, beforeEach for tests
const mongoose = require("mongoose");
const mongodbMemoryServer = require("mongodb-memory-server").default;

//explicit declaration for mongoose promises to follow behavior of default promise
mongoose.Promise = global.Promise;

//timeout to break from db invalid queries = 60 sec
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

const mongoServer = new mongodbMemoryServer();

const setup = async () => {
  const mongoURI = await mongoServer.getConnectionString();
  await mongoose
    .connect(
      mongoURI,
      { useNewUrlParser: true }
    )
    .then(
      () => console.log("database is ready"),
      error => console.error(error)
    );
};

const teardown = () => {
  mongoose.disconnect();
  mongoServer.stop();
};

module.exports = {
  setup,
  teardown
};
