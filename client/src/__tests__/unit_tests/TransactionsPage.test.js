import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import TransactionsPage from "../../pages/TransactionsPage";
import { fetchTransactionsAction, deleteTransactionAction } from "../../redux/actions/transactionActions";

jest.mock("../../redux/actions/transactionActions", () => ({
  fetchTransactionsAction: jest.fn(),
  deleteTransactionAction: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

// Helper function
const renderPageSuccessfully = async () => {
  render(
    <MemoryRouter>
      {" "}
      <TransactionsPage />{" "}
    </MemoryRouter>,
  );

  await waitFor(() =>
    expect(screen.queryByText(/loading transactions/i)).not.toBeInTheDocument(),
  );
};

describe("TransactionsPage", () => {
  let mockDispatch;
  beforeEach(() => {
    const mockTransactionsInDb = [
      {
        _id: "1",
        date: new Date().toISOString(),
        type: "Expense",
        amount: 100,
        category: { name: "Food" },
        description: "Pizza",
      },
      {
        _id: "2",
        date: new Date().toISOString(),
        type: "Income",
        amount: 200,
        category: { name: "Car" },
        description: "Fuel",
      },
    ];
    
    useSelector.mockImplementation((selector) =>
      selector({
        transactions: {
          transactions:
            mockTransactionsInDb,
          loading:
            false,
        },
        categories: {
          categories: [
            { _id: "categoryId1", name: "Clothing" },
            { _id: "categoryId2", name: "Food" },
          ],
        }
      })
    );

    mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", async () => {
    useSelector.mockImplementation((selector) =>
      selector({
        transactions: {
          loading:
            true,
        },
        categories: {}
      })
    );

    render(
      <MemoryRouter>
        {" "}
        <TransactionsPage />{" "}
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(screen.getByText(/loading transactions/i)).toBeInTheDocument(),
    );
  });

  it("renders transactions after loading", async () => {
    await renderPageSuccessfully();

    // buttons, table headings
    expect(
      screen.getByRole("button", { name: /new transaction/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /filter/i })).toBeInTheDocument();
    expect(screen.getByText(/date/i)).toBeInTheDocument();
    expect(screen.getByText(/category/i)).toBeInTheDocument();

    // transaction data
    expect(screen.getByText(/-\$100.00/i)).toBeInTheDocument();
    expect(screen.getByText(/\+\$200.00/i)).toBeInTheDocument();
    expect(screen.getByText(/car/i)).toBeInTheDocument();
    expect(screen.getByText(/fuel/i)).toBeInTheDocument();
    expect(screen.getByText(/pizza/i)).toBeInTheDocument();
  });

  it("opens addTransaction modal", async () => {
    await renderPageSuccessfully();

    fireEvent.click(screen.getByText(/new transaction/i));

    expect(screen.getByRole("button", { name: /add transaction/i })).toBeInTheDocument();
  });

  it("removes a transaction successfully", async () => {
    await renderPageSuccessfully();

    // Click to select the first transaction
    fireEvent.click(screen.getByText(/pizza/i));

    // Click the remove button for the selected transaction
    fireEvent.click(screen.getByRole("button", { name: /remove/i }));

    // Check if the deleteTransactionAPI function was called
    await waitFor(() =>
      expect(deleteTransactionAction).toHaveBeenCalledWith("1"),
    );
  });

  it("filters transactions", async () => {
    await renderPageSuccessfully();

    // Open the filter form and set filter
    fireEvent.click(screen.getByRole("button", { name: /filter/i }));
    
    expect(screen.getByText(/filter by category/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/filter by category/i), {
      target: { value: "categoryId2" },
    });

    // Check if the second call to fetchTransactionsAction is called with second parameter set to 'categoryId2'
    await waitFor(() =>
      expect(fetchTransactionsAction.mock.calls[1][1]).toBe("categoryId2"),
    );
  });
});
