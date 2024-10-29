import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RegisterPage from '../../components/RegisterPage';
import * as api from '../../services/api'; // Adjust the import based on your file structure

// Mock the registerUser function
jest.mock('../../services/api', () => ({
  registerUser: jest.fn(),
}));

describe('RegisterPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear any previous mock calls
  });

  test('renders the registration form', () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/create your account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('submits the form and navigates to the dashboard on successful registration', async () => {
    api.registerUser.mockResolvedValueOnce({
      status: 200,
      data: {
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
      },
    });

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Wait for navigation or any side effect to finish
    await new Promise((r) => setTimeout(r, 0));

    expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', 'mockAccessToken');
    expect(localStorage.setItem).toHaveBeenCalledWith('refreshToken', 'mockRefreshToken');
  });

  test('displays an error message on registration failure', async () => {
    api.registerUser.mockResolvedValueOnce({
      status: 400,
      data: {
        message: 'User already exists',
      },
    });

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await new Promise((r) => setTimeout(r, 0));

    expect(screen.getByText(/user already exists/i)).toBeInTheDocument();
  });

  test('displays a generic error message on unexpected errors', async () => {
    api.registerUser.mockRejectedValueOnce(new Error('Network Error'));

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await new Promise((r) => setTimeout(r, 0));

    expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
  });
});
