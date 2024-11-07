import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard, { getDateRange } from "../../components/Dashboard";
import {
  fetchTransactionsAPI,
  addTransactionAPI,
  deleteTransactionAPI,
} from "../../services/transactionAPI";

jest.mock("../../services/transactionAPI", () => ({
  fetchTransactionsAPI: jest.fn(),
  addTransactionAPI: jest.fn(),
  deleteTransactionAPI: jest.fn(),
}));

// Helper functions
const renderPageSuccessfully = async () => {
  render(
    <MemoryRouter>
      {" "}
      <Dashboard />{" "}
    </MemoryRouter>,
  );

  await waitFor(() =>
    expect(screen.queryByText(/loading transactions/i)).not.toBeInTheDocument(),
  );
};

describe("Dashboard", () => {
  let mockTransactionsInDb;
  const mockTransactionToAdd = {
    _id: "3",
    date: new Date().toISOString(),
    type: "Income",
    amount: 150,
    category: "Clothing",
    description: "Shoes",
  };

  beforeEach(() => {
    mockTransactionsInDb = [
      {
        _id: "1",
        date: new Date().toISOString(),
        type: "Expense",
        amount: 100,
        category: "Food",
        description: "Pizza",
      },
      {
        _id: "2",
        date: new Date().toISOString(),
        type: "Income",
        amount: 200,
        category: "Car",
        description: "Fuel",
      },
    ];
    jest.clearAllMocks();
  });

  it("renders loading state initially", async () => {
    fetchTransactionsAPI.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        {" "}
        <Dashboard />{" "}
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(screen.getByText(/loading transactions/i)).toBeInTheDocument(),
    );
  });

  it("renders transactions after loading", async () => {
    fetchTransactionsAPI.mockResolvedValueOnce({ data: mockTransactionsInDb });

    await renderPageSuccessfully();

    // title, buttons, table headings
    expect(screen.getByText(/your dashboard/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /new transaction/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /filter/i })).toBeInTheDocument();
    expect(screen.getByText(/date/i)).toBeInTheDocument();
    expect(screen.getByText(/category/i)).toBeInTheDocument();

    // transaction data
    expect(screen.getByText(/expense/i)).toBeInTheDocument();
    expect(screen.getByText(/100/i)).toBeInTheDocument();
    expect(screen.getByText(/car/i)).toBeInTheDocument();
    expect(screen.getByText(/fuel/i)).toBeInTheDocument();

    // bar chart
    expect(screen.getByText(/mocked bar chart/i)).toBeInTheDocument();
  });

  it("adds a new transaction successfully", async () => {
    fetchTransactionsAPI.mockResolvedValue({ data: mockTransactionsInDb });
    addTransactionAPI.mockResolvedValueOnce({}); // Mock successful addition of transaction

    await renderPageSuccessfully();

    // Open and fill in the new transaction form
    fireEvent.click(screen.getByText(/new transaction/i));
    fireEvent.change(screen.getByLabelText(/type/i), {
      target: { value: mockTransactionToAdd.type },
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: mockTransactionToAdd.category },
    });
    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: mockTransactionToAdd.amount },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: mockTransactionToAdd.description },
    });

    // Add mockTransaction to mockTransactionDb and submit form
    mockTransactionsInDb.push(mockTransactionToAdd);
    fireEvent.click(screen.getByRole("button", { name: /add transaction/i }));

    expect(addTransactionAPI).toHaveBeenCalledWith(
      {
        type: mockTransactionToAdd.type.toString(),
        category: mockTransactionToAdd.category.toString(),
        amount: mockTransactionToAdd.amount.toString(),
        description: mockTransactionToAdd.description.toString(),
      },
      null,
    );

    // Wait for the transactions to refresh
    await waitFor(() => expect(fetchTransactionsAPI).toHaveBeenCalledTimes(2)); // Check if fetchTransactions is called again

    // Check if the new transaction is rendered
    expect(screen.getByText(/shoes/i)).toBeInTheDocument();
  });

  it("removes a transaction successfully", async () => {
    fetchTransactionsAPI.mockResolvedValueOnce({ data: mockTransactionsInDb });
    deleteTransactionAPI.mockResolvedValueOnce({}); // Mock successful deletion of transaction

    await renderPageSuccessfully();

    // Click to select the first transaction
    fireEvent.click(screen.getByText(/pizza/i));

    // Click the remove button for the selected transaction
    fireEvent.click(screen.getByRole("button", { name: /remove/i }));

    // Check if the deleteTransactionAPI function was called
    await waitFor(() =>
      expect(deleteTransactionAPI).toHaveBeenCalledWith("1", null),
    );

    // Check if the transaction is removed from the DOM
    await waitFor(() =>
      expect(screen.queryByText(/pizza/i)).not.toBeInTheDocument(),
    );
  });

  it("filters transactions", async () => {
    fetchTransactionsAPI.mockResolvedValue({ data: mockTransactionsInDb });

    await renderPageSuccessfully();

    // Open the filter form and set filter
    fireEvent.click(screen.getByRole("button", { name: /filter/i }));
    fireEvent.change(screen.getByLabelText(/filter by category/i), {
      target: { value: "Food" },
    });

    // Check if the second call to fetchTransactions is called with second parameter set to 'Food'
    await waitFor(() => expect(fetchTransactionsAPI.mock.calls[1][1]).toBe("Food"));
  });
});

// Testing helper functions of dashboard.js
describe("getDateRange", () => {
  it('should return today\'s date range for "Today"', () => {
    const { startDate, endDate } = getDateRange("Today");
    const mockStartDate = new Date();
    mockStartDate.setHours(0, 0, 0, 0);
    const mockEndDate = new Date();

    expect(startDate).toEqual(mockStartDate);
    expect(endDate).toEqual(mockEndDate);
  });

  it('should return yesterday\'s date range for "Yesterday"', () => {
    const { startDate, endDate } = getDateRange("Yesterday");
    const mockStartDate = new Date();
    mockStartDate.setDate(mockStartDate.getDate() - 1);
    mockStartDate.setHours(0, 0, 0, 0);
    const mockEndDate = new Date(mockStartDate);
    mockEndDate.setHours(23, 59, 59, 999);

    expect(startDate).toEqual(mockStartDate);
    expect(endDate).toEqual(mockEndDate);
  });

  it('should return custom range for "Custom Range" with valid dates', () => {
    const customStartDate = "2024-01-01";
    const customEndDate = "2024-01-31";
    const { startDate, endDate } = getDateRange(
      "Custom Range",
      customStartDate,
      customEndDate,
    );
    const mockStartDate = new Date(customStartDate);
    mockStartDate.setHours(0, 0, 0, 0);
    const mockEndDate = new Date(customEndDate);
    mockEndDate.setHours(23, 59, 59, 999);

    expect(startDate).toEqual(mockStartDate);
    expect(endDate).toEqual(mockEndDate);
  });

  it('should return null for start and end date for "Custom Range" with invalid dates', () => {
    const { startDate, endDate } = getDateRange("Custom Range", null, null);
    expect(startDate).toBeNull();
    expect(endDate).toBeNull();
  });

  it("should return null for start and end date for an unknown range", () => {
    const { startDate, endDate } = getDateRange("Unknown Range");
    expect(startDate).toBeNull();
    expect(endDate).toBeNull();
  });
});
