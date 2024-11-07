import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RegisterPage from "../../components/RegisterPage";
import { registerUser } from "../../services/authAPI";

jest.mock("../../services/api", () => ({
  registerUser: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Helper functions
const fillAndSubmitForm = () => {
  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: "Test User" },
  });
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: "testUser@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "password123" },
  });
  fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
};
const renderPage = () => {
  render(
    <MemoryRouter>
      {" "}
      <RegisterPage />{" "}
    </MemoryRouter>,
  );
};

describe("RegisterPage", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: { setItem: jest.fn() },
      writable: true,
    });
    jest.clearAllMocks();
  });

  it("renders the registration form", () => {
    renderPage();

    expect(screen.getByText(/create your account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i }),
    ).toBeInTheDocument();
  });

  it("saves tokens to localStorage and redirects to dashboard on successful registration", async () => {
    registerUser.mockResolvedValueOnce({
      status: 200,
      data: {
        accessToken: "mockAccessToken",
        refreshToken: "mockRefreshToken",
      },
    });

    renderPage();
    fillAndSubmitForm();

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "accessToken",
        "mockAccessToken",
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "refreshToken",
        "mockRefreshToken",
      );
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows error message when user already exists", async () => {
    registerUser.mockResolvedValueOnce({
      status: 400,
      data: { message: "User already exists" },
    });

    renderPage();
    fillAndSubmitForm();

    await waitFor(() => {
      expect(screen.getByText(/user already exists/i)).toBeInTheDocument();
    });
  });

  it("displays a generic error message on unexpected errors", async () => {
    registerUser.mockRejectedValueOnce(new Error("Network Error"));

    renderPage();
    fillAndSubmitForm();

    await waitFor(() => {
      expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
    });
  });
});
