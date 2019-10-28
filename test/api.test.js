const request = require("supertest");
const server = require("../src/server");

describe("Smoke test", () => {
  it("GET /api/test", async () => {
    const app = await server();
    return request(app)
      .get("/api/test")
      .expect(200);
  });
});
