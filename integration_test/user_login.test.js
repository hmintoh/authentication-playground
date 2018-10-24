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

    const jwtTokenCookie = [expect.stringMatching(/jwt/)];
    expect(res.headers["set-cookie"]).toEqual(
      expect.arrayContaining(jwtTokenCookie)
    );
  });

  test("to login with invalid email", async () => {
    const email = "bogus@gmail.com";
    let password = user.password;
    let res = await request(app)
      .post("/api/user/login")
      .send({ user: { email: email, password: password } });

    expect(res.status).toBe(401);
    expect(res.body.error.message).toEqual("email or password is invalid");
  });

  test("to login with invalid password", async () => {
    const email = user.email;
    let password = "bogus";
    let res = await request(app)
      .post("/api/user/login")
      .send({ user: { email: email, password: password } });

    expect(res.status).toBe(401);
    expect(res.body.error.message).toEqual("email or password is invalid");
  });
});
