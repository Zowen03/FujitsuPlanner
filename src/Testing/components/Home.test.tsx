import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../../Pages/Home';
import { UserContext } from '../../Auth/UserContext';

describe('Home Component', () => {
  test('renders without crashing', () => {
    const TestComponent = () => (
      <UserContext.Provider 
        value={{ 
          loggedInUser: 'testuser', 
          setLoggedInUser: jest.fn(),
          userDetails: null,
          setUserDetails: jest.fn()
        }}
      >
        <Home />
      </UserContext.Provider>
    );

    render(<TestComponent />);
    expect(screen.getByText(/Todays Tasks/i)).toBeInTheDocument();
  });
});