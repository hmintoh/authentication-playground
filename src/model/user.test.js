const test_mongodb = require("../../test_helper/in_memory_mongodb_setup");
const User = require("./user");

beforeAll(test_mongodb.setup);
afterAll(test_mongodb.teardown);

const username = "min";
const email = "min@gmail.com";
const user = new User({ username: username, email: email });

beforeEach(async () => {
  await user.save();
});

describe("User model", () => {
  test("can be saved", async () => {
    const username2 = "min2";
    const email2 = "min2@gmail.com";
    const user2 = new User({ username: username2, email: email2 });
    await expect(user2.save()).resolves.toBe(user2);
  });

  test("can be searched by _id", async () => {
    const searchResult = await User.findOne({ _id: user._id });
    expect(searchResult.username).toEqual(user.username);
  });

  test("can be searched by username", async () => {
    const searchResult = await User.findOne({ username: "min" });
    expect(searchResult.username).toEqual(user.username);
  });

  test("can be searched by email", async () => {
    const searchResult = await User.findOne({ email: "min@gmail.com" });
    expect(searchResult.username).toEqual(user.username);
  });

  test("can be updated", async () => {
    user.username = "min updated";
    await user.save();
    const searchResult = await User.findOne({ _id: user._id });
    expect(searchResult.username).toEqual("min updated");
  });

  test("can be deleted", async () => {
    await user.remove();
    const searchResult = await User.findOne({ _id: user._id });
    expect(searchResult).toBeNull();
  });
});
