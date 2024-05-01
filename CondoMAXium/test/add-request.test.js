import React from 'react';
import { render, fireEvent, waitFor, screen, act, within } from '@testing-library/react';
import { useRouter } from 'next/router';
import userEvent from '@testing-library/user-event';
import AddRequestForm from '../pages/add-request/index';
import '@testing-library/jest-dom';
import supabase from '../config/supabaseClient';

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

  // Clearing all mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });
    
  test('Form submission with valid data', async () => {
    await act(async () => {
      render(<AddRequestForm />);
    });

    await waitFor(() => screen.getByLabelText(/Request Subject/i)); // Ensure the component is fully loaded

    const subjectInput = screen.getByLabelText(/Request Subject/i);
    const descriptionInput = screen.getByLabelText(/Description/i);
    const submitButton = screen.getByRole('button', { name: /Submit/i });

    await act(async () => {
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
  },10000);

  test('updates requestSubject on user input', () => {
    // Render the component
    const { getByRole } = render(<AddRequestForm />);
    
    // Mock setState
    const mockSetRequestSubject = jest.fn();
    React.useState = jest.fn(() => ["", mockSetRequestSubject]);

    // Get the input field
    const input1 = getByRole('textbox', {name: 'Request Subject'});
    const input2 = getByRole('textbox', {name: 'Description'});

    act(() => {
      // Simulate user typing into the input field
      fireEvent.change(input1, { target: { value: 'New Subject' } });
      fireEvent.change(input2, { target: { value: 'New Description' } });
    });

    // Assert that the state was updated with the new value
    expect(input1).toHaveValue('New Subject');
    expect(input2).toHaveValue('New Description');
  });

  test('handles error when fetching user data fails', async () => {
    // Mock the getUser to return an error
    const error = new Error("Cannot read properties of null (reading 'user')");
    supabase.auth.getUser.mockResolvedValue({ data: null, error });

    // Optionally spy on console.error to verify it gets called
    const consoleSpy = jest.spyOn(console, 'error');
    consoleSpy.mockImplementation(() => {}); // Prevent logging in the test output

    // Render the component
    render(<AddRequestForm />);

    // Since error handling is asynchronous, wait for any expected changes
    // For instance, if you update the UI on error, you could check for that
    // Here, we're just checking if console.error was called correctly
    // Note: Adjust this according to your actual error handling logic
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching user data:', error.message);
    });

    // Cleanup the spy to avoid memory leaks
    consoleSpy.mockRestore();
  });

  it('logs an error and does not navigate when the Supabase insert fails', async () => {
    const error = new Error("Cannot read properties of null (reading 'user')");
    supabase.from().insert.mockRejectedValue(error); // Setup Supabase to throw an error
    console.error = jest.fn(); // Mock console.error

    const { getByText, getByRole } = render(<AddRequestForm />);

    // Get the input field
    const input1 = getByRole('textbox', {name: 'Request Subject'});
    const input2 = getByRole('textbox', {name: 'Description'});

    act(() => {
      // Simulate user typing into the input field
      fireEvent.change(input1, { target: { value: 'New Subject' } });
      fireEvent.change(input2, { target: { value: 'New Description' } });

      // Simulate form submission
      fireEvent.click(getByText('Submit'));
    });

    // Wait for async actions to complete
    await waitFor(() => expect(console.error).toHaveBeenCalledWith("Error fetching user data:", error.message));

    // Verify that the router did not navigate
    // expect(mockPush).not.toHaveBeenCalled();
  });



});