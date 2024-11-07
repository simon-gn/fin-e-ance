import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "../../components/LoginPage";
import { loginUser } from "../../services/authAPI";

jest.mock("../../services/api", () => ({
  loginUser: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Helper functions
const fillAndSubmitForm = () => {
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: "testUser@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "password123" },
  });
  fireEvent.click(screen.getByRole("button", { name: /login/i }));
};
const renderPage = () => {
  render(
    <MemoryRouter>
      {" "}
      <LoginPage />{" "}
    </MemoryRouter>,
  );
};

describe("LoginPage", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: { setItem: jest.fn() },
      writable: true,
    });
    jest.clearAllMocks();
  });

  it("renders the login form", () => {
    renderPage();

    expect(screen.getByText(/fin\(e\)ance/i)).toBeInTheDocument();
    expect(
      screen.getByText(/track your financial transactions with ease./i),
    ).toBeInTheDocument();
    expect(screen.getByText(/login to your account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account?/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign up/i })).toBeInTheDocument();
  });

  it("saves tokens to localStorage and redirects to dashboard on successful login", async () => {
    loginUser.mockResolvedValueOnce({
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

  it("shows error message when email or password is incorrect", async () => {
    loginUser.mockResolvedValueOnce({
      status: 400,
      data: { message: "Invalid email or password" },
    });

    renderPage();
    fillAndSubmitForm();

    await waitFor(() => {
      expect(
        screen.getByText(/invalid email or password/i),
      ).toBeInTheDocument();
    });
  });

  it("displays a generic error message on unexpected errors", async () => {
    loginUser.mockRejectedValueOnce(new Error("Network Error"));

    renderPage();
    fillAndSubmitForm();

    await waitFor(() => {
      expect(screen.getByText(/login failed/i)).toBeInTheDocument();
    });
  });
});
