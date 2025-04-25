import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import TemplateList from '../../Pages/viewTemplate';
import { getTemplates, assignTemplate } from '../../api';
import { UserContext } from '../../Auth/UserContext';
import dayjs from 'dayjs';

// Mock API functions
jest.mock('../../api', () => ({
  getTemplates: jest.fn(),
  assignTemplate: jest.fn(),
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

describe('TemplateList Component', () => {
  const mockTemplates = [
    {
      id: '1',
      name: 'Template 1',
      createdAt: '2025-04-01T00:00:00Z',
      createdBy: 'User1',
      tasks: [
        { id: 't1', name: 'Task 1', time: 2 },
        { id: 't2', name: 'Task 2', time: 3 },
      ],
    },
    {
      id: '2',
      name: 'Template 2',
      createdAt: '2025-04-02T00:00:00Z',
      createdBy: 'User2',
      tasks: [],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the template list and search bar', async () => {
    (getTemplates as jest.Mock).mockResolvedValueOnce(mockTemplates);

    render(
      <UserContext.Provider value={{ loggedInUser: 'testuser' }}>
        <TemplateList />
      </UserContext.Provider>
    );

    // Verify the title and search bar
    expect(screen.getByRole('heading', { name: 'Templates' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search templates by name or creator')).toBeInTheDocument();

    // Wait for templates to load
    await act(async () => {
      expect(await screen.findByText('Template 1')).toBeInTheDocument();
      expect(await screen.findByText('Template 2')).toBeInTheDocument();
    });
  });

  test('searches for templates', async () => {
    (getTemplates as jest.Mock).mockResolvedValueOnce(mockTemplates);

    render(
      <UserContext.Provider value={{ loggedInUser: 'testuser' }}>
        <TemplateList />
      </UserContext.Provider>
    );

    // Enter search text and trigger search
    const searchInput = screen.getByPlaceholderText('Search templates by name or creator');
    fireEvent.change(searchInput, { target: { value: 'Template 1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    // Verify the API was called with the search text
    expect(getTemplates).toHaveBeenCalledWith('Template 1');
  });

  test('opens and closes the template details modal', async () => {
    (getTemplates as jest.Mock).mockResolvedValueOnce(mockTemplates);

    render(
      <UserContext.Provider value={{ loggedInUser: 'testuser' }}>
        <TemplateList />
      </UserContext.Provider>
    );

    // Wait for templates to load
    await act(async () => {
      expect(await screen.findByText('Template 1')).toBeInTheDocument();
    });

    // Open the details modal
    fireEvent.click(screen.getByText('Details'));

    // Verify modal content