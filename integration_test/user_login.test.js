process.env.NODE_ENV = "integration";

const test_mongodb = require("../test_helper/in_memory_mongodb_setup");
const app = require("../src/app");
const request = require("supertest");
const User = require("../src/model/user");

beforeAll(test_mongodb.setup);
afterAll(test_mongodb.teardown);

const username = "min";
const email = "min@gmail.com";
const password = "min's password";
const user = new User({ username, email });

beforeEach(async () => {
  user.setPassword(password);
  await user.save();
});

describe("user login", () => {
  test("login existing user successfully", async () => {
    let res = await request(app)
      .post("/api/user/login")
      .send({ user: { username: username, email: email, password: password } });

    expect(res.status).toBe(200);
    expect(res.body.user.email).toEqual(email);
    expect(res.body.user.token).toBeDefined();
    expect(res.body.user.token).not.toBeNull();
  });
});
