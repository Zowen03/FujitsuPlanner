import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import CreateTemplate from '../../Pages/createTemplate';
import { UserContext } from '../../Auth/UserContext';
import { createTemplate } from '../../api';

// Mock the `createTemplate` API function
jest.mock('../../api', () => ({
  createTemplate: jest.fn(),
}));

// Mock Ant Design message module
jest.mock('antd', () => {
  const originalModule = jest.requireActual('antd');
  return {
    ...originalModule,
    message: {
      success: jest.fn(),
      error: jest.fn(),
    },
  };
});

describe('CreateTemplate Component', () => {
  test('renders form when logged in and allows adding/removing tasks', async () => {
    const mockLoggedInUser = 'testuser';

    render(
      <UserContext.Provider value={{ 
        loggedInUser: mockLoggedInUser, 
        setLoggedInUser: jest.fn(), 
        userDetails: null, 
        setUserDetails: jest.fn() 
      }}>
        <CreateTemplate />
      </UserContext.Provider>
    );

    // Verify the form is rendered
    expect(screen.getByRole('heading', { name: 'Create Template' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter template name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Task Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Time Estimation (hours)')).toBeInTheDocument();

    // Add a task
    fireEvent.change(screen.getByPlaceholderText('Task Name'), { target: { value: 'Task 1' } });
    fireEvent.change(screen.getByPlaceholderText('Time Estimation (hours)'), { target: { value: 2 } });
    fireEvent.click(screen.getByRole('button', { name: 'Add Task' }));

    // Verify the task is added
    expect(screen.getByText('Task 1 - 2 hours')).toBeInTheDocument();

    // Remove the task
    fireEvent.click(screen.getByText('Remove'));

    // Verify the task is removed
    expect(screen.queryByText('Task 1 - 2 hours')).not.toBeInTheDocument();
  });

  test('displays error message when trying to submit without being logged in', async () => {
    render(
      <UserContext.Provider value={{ 
        loggedInUser: null, 
        setLoggedInUser: jest.fn(), 
        userDetails: null, 
        setUserDetails: jest.fn() 
      }}>
        <CreateTemplate />
      </UserContext.Provider>
    );

    // Try to submit the form
    fireEvent.click(screen.getByText('Create Template'));

    // Verify error message
    expect(screen.getByText('You must be logged in to create a template.')).toBeInTheDocument();
  });

  test('submits the template successfully when logged in', async () => {
    // Mock logged-in user
    const mockLoggedInUser = 'testuser';
    console.log('Logged in user:', mockLoggedInUser);

    // Mock API response
    (createTemplate as jest.Mock).mockResolvedValueOnce({ success: true });

    render(
      <UserContext.Provider value={{ 
        loggedInUser: mockLoggedInUser, 
        setLoggedInUser: jest.fn(), 
        userDetails: null, 
        setUserDetails: jest.fn() 
      }}>
        <CreateTemplate />
      </UserContext.Provider>
    );

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('Enter template name'), { target: { value: 'My Template' } });
    fireEvent.change(screen.getByPlaceholderText('Task Name'), { target: { value: 'Task 1' } });
    fireEvent.change(screen.getByPlaceholderText('Time Estimation (hours)'), { target: { value: 2 } });
    fireEvent.click(screen.getByRole('button', { name: 'Add Task' }));

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Create Template' }));
    });

    // Verify the API was called with the correct data
    expect(createTemplate).toHaveBeenCalledWith({
      name: 'My Template',
      tasks: [{ name: 'Task 1', time: 2, id: expect.any(String) }],
    });

    // Verify the success message was displayed
    const { message } = require('antd');
    expect(message.success).toHaveBeenCalledWith('Template created successfully!');
  });
});