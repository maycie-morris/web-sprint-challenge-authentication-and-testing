const db = require("../database/dbConfig.js");
const Users = require("./auth-model.js");

beforeEach(async () => {
  await db("users").truncate();
});

describe("models", () => {
  it("should insert correctly", async () => {
    await Users.insert({ username: "CodyHayes", password: "password1" });
    const users = await db("users");
    expect(users).toHaveLength(1);
  });
  it("should return data with findBy", async () => {
    await Users.findBy({ username: "cody" });
    const users = await db("users");
    expect(Array.isArray([users])).toBe(true);
  });
});