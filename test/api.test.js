const request = require("supertest");

const app = require("../build/index");

describe("GET /health check", () => {
  it("Response health check 200", (done) => {
    request(app)
      .get("/health")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });
});
