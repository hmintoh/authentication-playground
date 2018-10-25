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

async function loginAsUser(pw, agent) {
  let email = user.email;
  let res = await agent.post("/api/user/login").send({
    user: { email: email, password: pw }
  });

  expect(res.status).toBe(200);
}

test("Logout should clear the cookie storing JWT token", async () => {
  const agent = request.agent(app);
  await loginAsUser(password, agent);

  let logoutResponse = await agent.post("/api/user/logout").send();
  expect(logoutResponse.status).toBe(200);

  // if we try to change password after logout, we expect to get back
  // Unauthorized (HTTP 401) in the response
  const newPassword = "new-password";
  const updatedUser = {
    password: newPassword
  };

  let changePwdResponse = await agent
    .put("/api/user/change_password")
    .send({ user: updatedUser });

  expect(changePwdResponse.status).toBe(401);
});
