import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
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
      push:mockPush?
    })
}));

// Mocking supabase client
jest.mock('../config/supabaseClient', () => ({
  __esModule: true,
  default: {
    from: () => ({
      insert: jest.fn().mockResolvedValue({ data: { id: 123 }, error: null }),
    }),
  },
}));


describe('AddRequestForm component', () => {

    beforeEach(() => {
        // Mocking useRouter implementation
      mockPush.mockClear();
    });
    
  test('Form submission with valid data', async () => {
    render(<AddRequestForm />);

    const subjectInput = screen.getByLabelText(/Request Subject/i);
    const descriptionInput = screen.getByLabelText(/Description/i);
    const submitButton = screen.getByRole('button', { name: /Submit/i });

    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
    fireEvent.change(descriptionInput, { target: { value: 'A detailed description of the request.' } });

    // Simulate selecting a request type
    // Note: This approach assumes a specific implementation detail that might not match yours.
    // You might need to adjust based on your actual Select component implementation.
    fireEvent.mouseDown(screen.getByRole('button', { name: /Request Type/i }));
    const listbox = within(screen.getByRole('listbox'));
    fireEvent.click(listbox.getByText(/Maintenance/i));

    // Simulate form submission
    fireEvent.click(submitButton)

    await waitFor(() => {
      // Verify that navigation was not called
      expect(mockPush).not.toHaveBeenCalled();
    });
}); // Increase the timeout to 10000ms (10 seconds)

  
});
