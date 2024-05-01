import React from 'react';
import { render, fireEvent, waitFor, screen, act, within } from '@testing-library/react';
import { useRouter } from 'next/router';
import userEvent from '@testing-library/user-event';
import AddRequestForm from '../pages/add-request/index';

// Mock userRouter to push a new page

const mockPush = jest.fn();

jest.mock('../styles/units.module.css', () => {
  return {
    __esModule: true,
    default: {},
  };
});

jest.mock('next/router', () => ({
    useRouter: () => ({
      push:mockPush
    })
}));


// Mocking supabase client
jest.mock('../config/supabaseClient', () => ({
  __esModule: true,
  default: {
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: { email: 'test@example.com' }, session: null },
        error: null
      })
    },
    from: jest.fn(() => ({
      select: jest.fn().mockResolvedValue({
        data: [
          { subject: 'Subject 1', type: 'Type 1', assigned_to: 'User 1', status: 'Resolved' },
          // Additional mock data
        ],
        error: null
      }),
      insert: jest.fn().mockResolvedValue({
        data: { id: 123 },
        error: null
      })
    }))
  }
}));



describe('AddRequestForm component', () => {

    beforeEach(() => {
      mockPush.mockClear();
    });
    
  test('Form submission with valid data', async () => {
    await act(async () => {
      render(<AddRequestForm />);
    });

    await waitFor(() => screen.getByLabelText(/Request Subject/i)); // Ensure the component is fully loaded

    const subjectInput = screen.getByLabelText(/Request Subject/i);
    const descriptionInput = screen.getByLabelText(/Description/i);
    const submitButton = screen.getByRole('button', { name: /Submit/i });

    await act(() => {
      userEvent.type(subjectInput, 'Test Subject');
      userEvent.type(descriptionInput, 'A detailed description of the request.');
    });

    const requestTypeSelect = screen.getByRole('combobox', { name: /Request Type/i });
    await act(async () => {
      userEvent.click(requestTypeSelect); // Open dropdown
    });
   
    await waitFor(() => screen.getByRole('listbox'))
    const listbox = within(screen.getByRole('listbox'));
    await act(async () => {
      userEvent.click(listbox.getByText(/Maintenance/i));
    });
    

    // Simulate selecting a request type
    // Note: This approach assumes a specific implementation detail that might not match yours.
    // You might need to adjust based on your actual Select component implementation.

    // Simulate form submission
    await act(async () => {
      userEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/requests');
    });
});

});
