const mongoose = require("mongoose");
const Transaction = require("../../models/Transaction");
const Category = require("../../models/Category");
const {
  getTransactions,
  addTransaction,
} = require("../../controllers/transactionController");

describe("getTransactions", () => {
  it("should return sorted transactions from the database", async () => {
    const mockUserId = new mongoose.Types.ObjectId();

    const req = {
      user: { id: mockUserId.toString() },
      query: { type: "Expense" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    // Insert mock data into the in-memory database
    const category = await Category.create({
      name: 'Food',
      color: 'white',
    })

    await Transaction.create([
      {
        user: mockUserId,
        type: "Expense",
        category: category._id,
        amount: 100,
        date: new Date("2022-01-02"),
      },
      {
        user: mockUserId,
        type: "Expense",
        category: category._id,
        amount: 200,
        date: new Date("2022-01-01"),
      },
    ]);

    await getTransactions(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      expect.objectContaining({ amount: 100 }),
      expect.objectContaining({ amount: 200 }),
    ]);
  });

  // Test for correctly sorted...

  it("should return 500 for invalid input", async () => {
    const req = { query: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await getTransactions(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error fetching transactions",
      error: expect.any(Error),
    });
  });
});

describe("addTransaction", () => {
  it("should return 500 for invalid input", async () => {
    const req = { body: { type: "Expense", category: "Food", amount: 100 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await addTransaction(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: expect.any(String) });
  });
});
