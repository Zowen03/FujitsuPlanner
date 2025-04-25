import React, { useContext } from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserProvider, UserContext } from '../../Auth/UserContext';
import { checkSession } from '../../api';

jest.mock('../../api', () => ({
  checkSession: jest.fn() as jest.Mock<Promise<{ success: boolean; user?: { username: string; email: string } }>>,
}));

// Mock the `checkSession` API call
jest.mock('../../api', () => ({
  checkSession: jest.fn(),
}));

describe('UserContext', () => {
  const mockUser = {
    username: 'testuser',
    email: 'testuser@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('provides default values when no user is logged in', () => {
    const TestComponent = () => {
      const { loggedInUser, userDetails } = useContext(UserContext);
      return (
        <div>
          <div data-testid="loggedInUser">{loggedInUser || 'null'}</div>
          <div data-testid="userDetails">{userDetails ? JSON.stringify(userDetails) : 'null'}</div>
        </div>
      );
    };

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    expect(screen.getByTestId('loggedInUser')).toHaveTextContent('null');
    expect(screen.getByTestId('userDetails')).toHaveTextContent('null');
  });

  test('updates context values when session check succeeds', async () => {
    (checkSession as jest.Mock).mockResolvedValue({
      success: true,
      user: mockUser,
    });

    const TestComponent = () => {
      const { loggedInUser, userDetails } = useContext(UserContext);
      return (
        <div>
          <div data-testid="loggedInUser">{loggedInUser || 'null'}</div>
          <div data-testid="userDetails">{userDetails ? JSON.stringify(userDetails) : 'null'}</div>
        </div>
      );
    };

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loggedInUser')).toHaveTextContent(mockUser.username);
      expect(screen.getByTestId('userDetails')).toHaveTextContent(JSON.stringify(mockUser));
    });
  });

  test('does not update context values when session check fails', async () => {
    (checkSession as jest.Mock).mockRejectedValue(new Error('Session check failed'));

    const TestComponent = () => {
      const { loggedInUser, userDetails } = useContext(UserContext);
      return (
        <div>
          <div data-testid="loggedInUser">{loggedInUser || 'null'}</div>
          <div data-testid="userDetails">{userDetails ? JSON.stringify(userDetails) : 'null'}</div>
        </div>
      );
    };

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loggedInUser')).toHaveTextContent('null');
      expect(screen.getByTestId('userDetails')).toHaveTextContent('null');
    });
  });

  test('allows updating context values via setLoggedInUser and setUserDetails', async () => {
    const TestComponent = () => {
      const { loggedInUser, userDetails, setLoggedInUser, setUserDetails } = useContext(UserContext);

      return (
        <div>
          <div data-testid="loggedInUser">{loggedInUser || 'null'}</div>
          <div data-testid="userDetails">{userDetails ? JSON.stringify(userDetails) : 'null'}</div>
          <button onClick={() => setLoggedInUser('newuser')}>Set Logged In User</button>
          <button onClick={() => setUserDetails({ username: 'newuser', email: 'newuser@example.com' })}>
            Set User Details
          </button>
        </div>
      );
    };

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    // Initial state assertions
    expect(screen.getByTestId('loggedInUser')).toHaveTextContent('null');
    expect(screen.getByTestId('userDetails')).toHaveTextContent('null');

    // Trigger state updates
    await act(async () => {
      screen.getByText('Set Logged In User').click();
      screen.getByText('Set User Details').click();
    });

    // Assert updated state
    expect(screen.getByTestId('loggedInUser')).toHaveTextContent('newuser');
    expect(screen.getByTestId('userDetails')).toHaveTextContent(
      JSON.stringify({ username: 'newuser', email: 'newuser@example.com' })
    );
  });
});