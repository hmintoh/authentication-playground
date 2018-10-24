const test_mongodb = require("../../test_helper/in_memory_mongodb_setup");
const User = require("./user");

//start and end server after all, instantiate user beforeEach
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
    // user.username = "min updated";
    // await user.save();
    // const searchResult = await User.findOne({_id: user._id});
    const searchResult = await User.findByIdAndUpdate(
      user._id,
      { username: "min updated" },
      { new: true }
    );
    expect(searchResult.username).toEqual("min updated");
  });

  test("can be deleted", async () => {
    await user.remove();
    const searchResult = await User.findOne({ _id: user._id });
    expect(searchResult).toBeNull();
  });
});

describe("unique fields in User model", () => {
  test("should not allow same 2 emails to be saved", async () => {
    const newEmail = "min2@gmail.com";
    const newUserWithSameUsername = new User({
      username: user.username,
      email: newEmail
    });
    await expect(newUserWithSameUsername.save()).rejects.toThrow(
      "email: should be unique"
    );
  });

  test("should not allow same 2 usernames to be saved", async () => {
    const newUsername = "min2";
    const newUserWithSameEmail = new User({
      username: newUsername,
      email: user.email
    });
    await expect(newUserWithSameEmail.save()).rejects.toThrow(
      "username: should be unique"
    );
  });
});

describe("email and username is required", async () => {
  test("username is missing", async () => {
    const usernameIsMissing = new User({
      email: "min4@gmail.com"
    });
    await expect(usernameIsMissing.save()).rejects.toThrow("is required");
  });

  test("email is missing", async () => {
    const emailIsMissing = new User({
      username: "min@gmail.com"
    });
    await expect(emailIsMissing.save()).rejects.toThrow("is required");
  });
});
