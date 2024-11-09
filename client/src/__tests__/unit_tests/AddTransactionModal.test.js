import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import AddTransactionModal from "../../components/modals/AddTransactionModal";
import { addTransactionAction } from "../../redux/actions/transactionActions";

jest.mock("../../redux/actions/transactionActions", () => ({
  addTransactionAction: jest.fn(),
}));

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

const mockTransactionToAdd = {
  _id: "1",
  date: new Date().toISOString(),
  type: "Income",
  amount: 150,
  category: { _id: "categoryId1", name: "Clothing" },
  description: "Shoes",
};

describe("AddTransactionModal", () => {
  let mockDispatch;
  beforeEach(() => {
    useSelector.mockImplementation((selector) =>
      selector({
        categories: {
          categories: [
            { _id: "categoryId1", name: "Clothing" },
            { _id: "categoryId2", name: "Food" },
          ],
        },
      }),
    );

    mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);

    render(
      <MemoryRouter>
        {" "}
        <AddTransactionModal isOpen={true} onClose={jest.fn()} />{" "}
      </MemoryRouter>,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("adds a new transaction successfully", async () => {
    addTransactionAction.mockReturnValue({
      type: "ADD_TRANSACTION",
      payload: {
        type: "Income",
        amount: 150,
        category: "Clothing",
        description: "Shoes",
      },
    });

    // Fill in new transaction form
    fireEvent.change(screen.getByLabelText(/type/i), {
      target: { value: mockTransactionToAdd.type },
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: mockTransactionToAdd.category._id },
    });
    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: mockTransactionToAdd.amount },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: mockTransactionToAdd.description },
    });

    fireEvent.click(screen.getByRole("button", { name: /add transaction/i }));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "ADD_TRANSACTION",
      payload: {
        type: mockTransactionToAdd.type.toString(),
        amount: mockTransactionToAdd.amount,
        category: mockTransactionToAdd.category.name.toString(),
        description: mockTransactionToAdd.description.toString(),
      },
    });
  });
});
