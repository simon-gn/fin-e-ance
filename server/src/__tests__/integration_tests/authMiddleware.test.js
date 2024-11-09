const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../../middleware/authMiddleware");
require("dotenv").config();

const app = express();
app.use(express.json());

app.get("/protected", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Access granted", user: req.user });
});

describe("Auth Middleware", () => {
  it("should return 403 if no token is provided", async () => {
    const response = await request(app).get("/protected");

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ message: "No token provided" });
  });

  it("should return 401 if token is invalid", async () => {
    const invalidToken = "invalidToken";
    const response = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${invalidToken}`);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      valid: false,
      message: "Token expired or invalid",
      err: expect.any(Object),
    });
  });

  it("should allow access if token is valid", async () => {
    const validToken = jwt.sign({ id: "testuser" }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const response = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("Access granted");
    expect(response.body.user.id).toEqual("testuser");
  });
});
