import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import TransactionsPage from "../../pages/TransactionsPage";
import { deleteTransactionAction } from "../../redux/actions/transactionActions";

jest.mock("../../redux/actions/transactionActions", () => ({
  fetchTransactionsAction: jest.fn(),
  deleteTransactionAction: jest.fn(),
}));

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

// Helper function
const renderPageSuccessfully = async () => {
  render(
    <MemoryRouter>
      {" "}
      <TransactionsPage />{" "}
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByRole("button", { name: /filter/i })).toBeInTheDocument();
    expect(screen.getByText(/date/i)).toBeInTheDocument();
    expect(screen.getByText(/category/i)).toBeInTheDocument();
  });
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
          transactions: mockTransactionsInDb,
          loading: false,
        },
        categories: {
          categories: [
            { _id: "categoryId1", name: "Food" },
            { _id: "categoryId2", name: "Car" },
          ],
        },
      })
    );

    mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders transactions after loading", async () => {
    await renderPageSuccessfully();

    expect(screen.getByText(/-\$100.00/i)).toBeInTheDocument();
    expect(screen.getByText(/\+\$200.00/i)).toBeInTheDocument();
    expect(screen.getByText(/car/i)).toBeInTheDocument();
    expect(screen.getByText(/fuel/i)).toBeInTheDocument();
    expect(screen.getByText(/pizza/i)).toBeInTheDocument();
  });

  it("removes a transaction successfully", async () => {
    await renderPageSuccessfully();

    // Click to select the first transaction
    fireEvent.click(screen.getByText(/pizza/i));

    // Click the remove button for the selected transaction
    fireEvent.click(screen.getByRole("button", { name: /removeButton/i }));

    // Check if the deleteTransactionAPI function was called
    await waitFor(() =>
      expect(deleteTransactionAction).toHaveBeenCalledWith("1")
    );
  });

  it("open filter form and set filter option", async () => {
    await renderPageSuccessfully();

    // Open filter form
    fireEvent.click(screen.getByRole("button", { name: /filter/i }));

    // Check that filter options are in the document with the initial value "all"
    const categoryComboBox = screen.getByRole("combobox", {
      name: /Category/i,
    });
    expect(categoryComboBox).toBeInTheDocument();
    expect(categoryComboBox.value).toBe("all");

    // Set the filter option to specific value
    fireEvent.change(categoryComboBox, { target: { value: "Food" } });

    // Assert that the value has been updated
    expect(categoryComboBox.value).toBe("Food");
  });
});
