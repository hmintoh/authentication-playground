const test_mongodb = require("../../test_helper/in_memory_mongodb_setup");
const User = require("./user");

beforeEach(test_mongodb.setup);
afterEach(test_mongodb.teardown);

describe("User model", () => {
  const username = "min";
  const email = "min@gmail.com";

  const user = new User({ username: username, email: email });

  test("can be saved", async () => {
    await expect(user.save()).resolves.toBe(user);
  });
});
