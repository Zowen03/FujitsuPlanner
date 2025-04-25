import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../App';
import { UserContext } from '../../Auth/UserContext';

describe('App Component', () => {
  test('renders the App and navigates between sections', () => {
    render(
      <UserContext.Provider
        value={{
          loggedInUser: 'testuser',
          setLoggedInUser: jest.fn(),
          userDetails: null,
          setUserDetails: jest.fn(),
        }}
      >
        <App />
      </UserContext.Provider>
    );

    // Verify the default content
    expect(screen.getByText('Welcome to Fujitsu Growth')).toBeInTheDocument();

    // Navigate to "Create Template"
    fireEvent.click(screen.getByText('Create Template'));
    expect(screen.getByText('Create Template')).toBeInTheDocument();

    // Navigate to "View Templates"
    fireEvent.click(screen.getByText('View Templates'));
    expect(screen.getByText('Templates')).toBeInTheDocument();

    // Navigate to "My Plans"
    fireEvent.click(screen.getByText('Plan 1'));
    expect(screen.getByText('My Learning Plan')).toBeInTheDocument();
  });

  test('renders default content when no user is logged in', () => {
    render(
      <UserContext.Provider
        value={{
          loggedInUser: null,
          setLoggedInUser: jest.fn(),
          userDetails: null,
          setUserDetails: jest.fn(),
        }}
      >
        <App />
      </UserContext.Provider>
    );

    // Verify the default content
    expect(screen.getByText('Welcome to Fujitsu Growth')).toBeInTheDocument();
    expect(screen.getByText('Select an option from the menu to get started')).toBeInTheDocument();
  });
});