const request = require("supertest");
const app = require("../../index");

describe("Index", () => {
  it("should respond to GET /", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("fin(e)ance.");
  });

  it("should use the authRoutes", async () => {
    const response = await request(app).post("/api/auth");
    expect(response.status).toBeDefined();
  });

  it("should use the transactionRoutes", async () => {
    const response = await request(app).get("/api/transactions");
    expect(response.status).toBeDefined();
  });
});
