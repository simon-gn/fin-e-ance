const mongoose = require("mongoose");
const {
  getTransactions,
  addTransaction,
  deleteTransaction,
} = require("../../controllers/transactionController");
const Transaction = require("../../models/Transaction");
const {
  addAccountBalance,
  deleteAccountBalance,
} = require("../../controllers/accountBalanceController");

jest.mock("../../models/Transaction", () => ({
  find: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
}));
jest.mock("../../controllers/accountBalanceController", () => ({
  addAccountBalance: jest.fn(),
  deleteAccountBalance: jest.fn(),
}));

let req, res;
beforeEach(() => {
  res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  jest.clearAllMocks();
});

describe("getTransactions", () => {
  it("should return filtered transactions", async () => {
    const mockTransactions = [
      {
        user: { id: "testUser" },
        type: "Expense",
        category: "Food",
        amount: 100,
      },
      {
        user: { id: "testUser" },
        type: "Expense",
        category: "Car",
        amount: 200,
      },
    ];

    Transaction.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockTransactions),
      }),
    });

    req = {
      user: { id: "testUser" },
      query: {
        type: "Expense",
        category: "Food",
        startDate: new Date(),
        endDate: new Date(),
      },
    };

    await getTransactions(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockTransactions);
    expect(Transaction.find).toHaveBeenCalledWith(
      expect.objectContaining({
        user: "testUser",
        type: "Expense",
        category: "Food",
        date: { $gte: expect.any(Date), $lte: expect.any(Date) },
      })
    );
    expect(Transaction.find().populate().sort).toHaveBeenCalledWith({
      date: -1,
      createdAt: -1,
    });
  });

  it("should return all transactions (no filter parameters)", async () => {
    const mockTransactions = [
      {
        user: { id: "testUser" },
        type: "Expense",
        category: "Food",
        amount: 100,
      },
      {
        user: { id: "testUser" },
        type: "Expense",
        category: "Car",
        amount: 200,
      },
    ];

    Transaction.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockTransactions),
      }),
    });

    req = { user: { id: "testUser" }, query: {} };

    await getTransactions(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockTransactions);
    expect(Transaction.find).toHaveBeenCalledWith(expect.objectContaining({}));
    expect(Transaction.find().populate().sort).toHaveBeenCalledWith({
      date: -1,
      createdAt: -1,
    });
  });

  it("should handle errors and return 500", async () => {
    let err = new Error("Fetch error");
    Transaction.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        sort: jest.fn().mockRejectedValue(err),
      }),
    });

    await getTransactions(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error fetching transactions",
      error: err,
    });
  });
});

describe("addTransaction", () => {
  it("should add transaction and return 201", async () => {
    Transaction.create.mockReturnValue({ _id: "transactionId" });
    Transaction.findById.mockReturnValue({
      populate: jest.fn(),
    });
    addAccountBalance.mockReturnValue({});
    req = { user: { id: "testUser" }, body: { type: "Expense" } };

    await addTransaction(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("should handle errors and return 500", async () => {
    Transaction.create.mockRejectedValue(new Error("Create error"));

    await addTransaction(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Create error" });
  });
});

describe("deleteTransaction", () => {
  it("should delete transaction and return 200", async () => {
    const mockUserId = new mongoose.Types.ObjectId();
    const mockTransaction = { user: mockUserId, deleteOne: jest.fn() };

    Transaction.findById.mockReturnValue(mockTransaction);
    deleteAccountBalance.mockReturnValue({});

    const req = { user: { id: mockUserId.toString() }, body: "transactionId" };

    await deleteTransaction(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Transaction removed" });
  });

  it("should return 404 if no transaction is found", async () => {
    Transaction.findById.mockReturnValue(null);

    const req = { user: { id: "testUser" }, body: "transactionId" };

    await deleteTransaction(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Transaction not found" });
  });

  it("should return 401 if transaction does not belong to user", async () => {
    const mockUserId = new mongoose.Types.ObjectId();
    const mockTransaction = { user: mockUserId };

    Transaction.findById.mockReturnValue(mockTransaction);

    const req = { user: { id: "nonMatchingUserId" }, body: "transactionId" };

    await deleteTransaction(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
  });

  it("should handle errors and return 500", async () => {
    Transaction.findById.mockRejectedValue(new Error("Delete error"));

    await deleteTransaction(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Delete error" });
  });
});
