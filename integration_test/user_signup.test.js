process.env.NODE_ENV = "integration";

const test_mongodb = require("../test_helper/in_memory_mongodb_setup");
const app = require("../src/app");
const request = require("supertest");

beforeAll(test_mongodb.setup);
afterAll(test_mongodb.teardown);

describe("new user signup", () => {
  test("register new user successfully", async () => {
    const username = "min";
    const email = "min@gmail.com";
    const password = "min's password";

    let res = await request(app)
      .post("/api/user/signup")
      .send({ user: { username: username, email: email, password: password } });

    expect(res.status).toBe(200);
    expect(res.body.user.username).toEqual(username);
    expect(res.body.user.email).toEqual(email);
  });
});
