import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RegLog from '../../Auth/RegLog';
import { UserContext } from '../../Auth/UserContext';
import '@testing-library/jest-dom';

jest.mock('../api', () => ({
  register: jest.fn(),
  login: jest.fn(),
}));

describe('RegLog Component', () => {
  test('shows login form by default', () => {
    render(
      <UserContext.Provider value={{ loggedInUser: null, setLoggedInUser: jest.fn() }}>
        <RegLog />
      </UserContext.Provider>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
  });

  test('switches to register form', () => {
    render(
      <UserContext.Provider value={{ loggedInUser: null, setLoggedInUser: jest.fn() }}>
        <RegLog />
      </UserContext.Provider>
    );

    fireEvent.click(screen.getByText('Create account'));
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
  });

  test('shows user info when logged in', () => {
    render(
      <UserContext.Provider value={{ loggedInUser: 'testuser', setLoggedInUser: jest.fn() }}>
        <RegLog />
      </UserContext.Provider>
    );

    expect(screen.getByText('testuser')).toBeInTheDocument();
  });
});