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

test("change password on current user", async () => {
  const agent = request.agent(app);
  await loginAsUser(password, agent);

  const newPassword = "new password";
  const updatedUser = {
    password: newPassword
  };

  let res = await agent
    .put("/api/user/change_password")
    .send({ user: updatedUser });

  expect(res.status).toBe(200);

  const agent2 = request(app);
  await loginAsUser(newPassword, agent2);
});
