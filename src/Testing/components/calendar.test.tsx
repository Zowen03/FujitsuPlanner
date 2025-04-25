import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LinearTaskCalendar from '../../Pages/calendar';
import dayjs from 'dayjs';

describe('LinearTaskCalendar Component', () => {
  const mockAssignments = [
    {
      id: '1',
      templateId: 'template1',
      startDate: '2025-04-01',
      hoursPerWeek: 10,
    },
  ];

  const mockTemplates = [
    {
      id: 'template1',
      tasks: [
        { id: 'task1', name: 'Task 1', time: 2, isComplete: false },
        { id: 'task2', name: 'Task 2', time: 3, isComplete: true },
      ],
    },
  ];

  test('renders loading spinner when loading is true', () => {
    render(<LinearTaskCalendar assignments={[]} templates={[]} loading={true} />);
    expect(screen.getByRole('status')).toBeInTheDocument(); // Ant Design's Spin component uses role="status"
  });

  test('renders progress bar and calendar when loading is false', () => {
    render(
      <LinearTaskCalendar assignments={mockAssignments} templates={mockTemplates} loading={false} />
    );

    // Verify progress bar
    expect(screen.getByText('3h / 5h (60%)')).toBeInTheDocument();

    // Verify calendar is rendered
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  test('displays tasks in the calendar and opens modal on day click', () => {
    render(
      <LinearTaskCalendar assignments={mockAssignments} templates={mockTemplates} loading={false} />
    );

    // Find a day with tasks
    const taskBadge = screen.getByText('Task 1 (2h)');
    expect(taskBadge).toBeInTheDocument();

    // Click on the day to open the modal
    fireEvent.click(taskBadge);

    // Verify modal content
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Hours: 2h')).toBeInTheDocument();
    expect(screen.getByText('Status: In Progress')).toBeInTheDocument();
  });

  test('closes the modal when cancel button is clicked', () => {
    render(
      <LinearTaskCalendar assignments={mockAssignments} templates={mockTemplates} loading={false} />
    );

    // Open the modal
    fireEvent.click(screen.getByText('Task 1 (2h)'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Close the modal
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('handles empty assignments and templates gracefully', () => {
    render(<LinearTaskCalendar assignments={[]} templates={[]} loading={false} />);

    // Verify progress bar shows 0h
    expect(screen.getByText('0h / 0h (0%)')).toBeInTheDocument();

    // Verify calendar is rendered
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  test('calculates progress correctly for completed tasks', () => {
    const assignments = [
      {
        id: '1',
        templateId: 'template1',
        startDate: '2025-04-01',
        hoursPerWeek: 10,
      },
    ];

    const templates = [
      {
        id: 'template1',
        tasks: [
          { id: 'task1', name: 'Task 1', time: 2, isComplete: true },
          { id: 'task2', name: 'Task 2', time: 3, isComplete: true },
        ],
      },
    ];

    render(<LinearTaskCalendar assignments={assignments} templates={templates} loading={false} />);

    // Verify progress bar shows 100%
    expect(screen.getByText('5h / 5h (100%)')).toBeInTheDocument();

    // Verify success alert is displayed
    expect(screen.getByText('All tasks completed! 🎉')).toBeInTheDocument();
  });
});