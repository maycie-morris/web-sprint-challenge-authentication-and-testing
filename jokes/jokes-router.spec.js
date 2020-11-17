const request = require("supertest");
const server = require("../api/server.js");
const jwt = require("jsonwebtoken");
const secret = require("../api/config");

let token;

beforeAll(done => {
  request(server)
    .post("api/auth/login")
    .send({
      username: "cody",
      password: "pass"
    })
    .end((err, response) => {
      token = response.body.token;
      done();
    });
});

describe("jokes router", () => {
  it("should return 200", async () => {
    const Token = await jwt.verify(token, secret.jwtSecret);
    const users = await request(server)
      .get("/api/jokes")
      .set("authorization", Token);

    expect(users.response).toBe(200);
  });
});