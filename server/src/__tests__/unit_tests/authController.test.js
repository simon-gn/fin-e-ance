const {
  registerUser,
  loginUser,
  refreshToken,
  validateToken,
} = require("../../controllers/authController");
const User = require("../../models/User");
const RefreshToken = require("../../models/RefreshToken");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();

jest.mock("../../models/User");
jest.mock("../../models/RefreshToken", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  updateOne: jest.fn(),
}));
jest.mock("bcryptjs", () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
  compare: jest.fn(),
}));
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));
jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

describe("registerUser", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: { name: "testUser", email: "testUser@web.de", password: "1111" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("should return access and refresh tokens when registration is successful", async () => {
    const mockUser = {
      id: "12345",
      name: "testUser",
      email: "testUser@web.de",
      password: "1111",
      save: jest.fn(),
    };

    User.findOne.mockResolvedValue(null); // User does not yet exist
    User.mockReturnValue(mockUser);
    bcryptjs.genSalt.mockResolvedValue("salt");
    bcryptjs.hash.mockResolvedValue("hashedpassword");
    jwt.sign.mockReturnValue("accessToken");
    uuidv4.mockReturnValue("refreshToken");
    RefreshToken.create.mockResolvedValue();

    await registerUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: "testUser@web.de" });
    expect(User).toHaveBeenCalledWith({
      name: "testUser",
      email: "testUser@web.de",
      password: "1111",
    });
    expect(bcryptjs.hash).toHaveBeenCalledWith("1111", "salt");
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: "12345" },
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
    );
    expect(RefreshToken.create).toHaveBeenCalledWith({
      token: "refreshToken",
      userId: "12345",
      expiresAt: expect.any(Date),
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      accessToken: "accessToken",
      refreshToken: "refreshToken",
    });
  });

  it("should return 400 if user already exists", async () => {
    User.findOne.mockResolvedValue({ id: "existingUser" });

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "User already exists" });
  });

  it("should handle errors and return 500", async () => {
    User.findOne.mockRejectedValue(new Error("Register error"));

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Register error" });
  });
});

describe("loginUser", () => {
  let req, res;

  beforeEach(() => {
    req = { body: { email: "testUser@web.de", password: "1111" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("should return access and refresh tokens when login is successful", async () => {
    const mockUser = {
      id: "12345",
      name: "testUser",
      email: "testUser@web.de",
      password: "1111",
    };

    User.findOne.mockResolvedValue(mockUser);
    bcryptjs.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("accessToken");
    uuidv4.mockReturnValue("refreshToken");
    RefreshToken.create.mockResolvedValue();

    await loginUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: "testUser@web.de" });
    expect(bcryptjs.compare).toHaveBeenCalledWith("1111", "1111");
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: "12345" },
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
    );
    expect(RefreshToken.create).toHaveBeenCalledWith({
      token: "refreshToken",
      userId: "12345",
      expiresAt: expect.any(Date),
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      accessToken: "accessToken",
      refreshToken: "refreshToken",
    });
  });

  it("should return 400 if email is not registered", async () => {
    User.findOne.mockResolvedValue({ password: "2222" });
    bcryptjs.compare.mockResolvedValue(false);

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid email or password",
    });
  });

  it("should return 400 if password is incorrect", async () => {
    User.findOne.mockResolvedValue(null);

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid email or password",
    });
  });

  it("should handle errors and return 500", async () => {
    User.findOne.mockRejectedValue(new Error("Login error"));

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Login error" });
  });
});

describe("refreshToken", () => {
  let req, res;

  beforeEach(() => {
    req = { body: { refreshToken: "refreshToken" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("should refresh access and refresh tokens and return them", async () => {
    const mockValidRefreshTokenDoc = {
      userId: "existingUser",
      expiresAt: new Date(Date.now() + 60 * 1000),
      revoked: false,
    };

    RefreshToken.findOne.mockResolvedValue(mockValidRefreshTokenDoc);
    User.findById.mockResolvedValue({ id: "existingUser" });
    jwt.sign.mockReturnValue("newAccessToken");
    uuidv4.mockReturnValue("newRefreshToken");
    RefreshToken.create.mockResolvedValue();
    RefreshToken.updateOne.mockResolvedValue();

    await refreshToken(req, res);

    expect(RefreshToken.findOne).toHaveBeenCalledWith({
      token: "refreshToken",
    });
    expect(User.findById).toHaveBeenCalledWith("existingUser");
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: "existingUser" },
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
    );
    expect(RefreshToken.create).toHaveBeenCalledWith({
      token: "newRefreshToken",
      userId: "existingUser",
      expiresAt: expect.any(Date),
    });
    expect(RefreshToken.updateOne).toHaveBeenCalledWith(
      { token: "refreshToken" },
      { revoked: true },
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      accessToken: "newAccessToken",
      refreshToken: "newRefreshToken",
    });
  });

  it("should return 403 if refresh token is not existing", async () => {
    RefreshToken.findOne.mockResolvedValue(null);

    await refreshToken(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid refresh token" });
  });

  it("should return 403 if refresh token is revoked", async () => {
    RefreshToken.findOne.mockResolvedValue({ revoked: true });

    await refreshToken(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid refresh token" });
  });

  it("should return 401 if refresh token is expired", async () => {
    RefreshToken.findOne.mockResolvedValue({
      expiresAt: new Date(Date.now() - 60 * 1000),
      revoked: false,
    });

    await refreshToken(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Refresh token expired" });
  });

  it("should return 403 if no user is associated with refresh token", async () => {
    RefreshToken.findOne.mockResolvedValue({
      userId: "nonExistingUser",
      expiresAt: new Date(Date.now() + 60 * 1000),
      revoked: false,
    });
    User.findById.mockResolvedValue(null);

    await refreshToken(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should handle errors and return 500", async () => {
    RefreshToken.findOne.mockRejectedValue(new Error("Refresh token error"));

    await refreshToken(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Refresh token error" });
  });
});

describe("validateToken", () => {
  it("should return 200 and set valid to true", async () => {
    let req, res;
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await validateToken(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ valid: true });
  });
});
