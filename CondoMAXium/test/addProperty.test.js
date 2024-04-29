import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import '@testing-library/jest-dom';
import supabase from '../config/supabaseClient';
import AddPropertyForm from '../pages/add-property/index';

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

jest.mock('../config/supabaseClient', () => ({
    from: jest.fn().mockReturnThis(),
    insert: jest.fn(),
    auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user123' } } }),
    },
}));

// Mock console.error to throw an error
console.error = jest.fn().mockImplementation(() => {
    throw new Error('console.error called');
});
// Mock console.error to spy on it
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

// Mock window.alert
const mockAlert = jest.fn();
global.alert = mockAlert;

// Mock console.log to do nothing
console.log = jest.fn();




//testing

describe('AddPropertyForm Component', () => {

    // Clearing userRouter mock before each test
    beforeEach(() => {
        useRouter.mockClear();
    });

    // Clearing all mocks after each test
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders the AddPropertyForm component without errors', () => {
        render(<AddPropertyForm />);
    });

    test('does not log user ID when no user is present', async () => {
        // Setup the response to not include a user
        supabase.auth.getUser.mockResolvedValue({
            data: null,
            error: null
        });
    
        const logSpy = jest.spyOn(console, 'log');
    
        render(<AddPropertyForm />);
    
        await waitFor(() => {
            expect(logSpy).not.toHaveBeenCalledWith("User ID set:", expect.any(String));
        });
    
        logSpy.mockRestore();
    });

    test('logs and sets userId when data contains a user', async () => {
        // Set up the Supabase mock to return a user
        supabase.auth.getUser.mockResolvedValue({
          data: { user: { id: 'user123' } },
          error: null
        });
    
        // Spy on console.log before the component renders
        const logSpy = jest.spyOn(console, 'log');
    
        // Render your component
        render(<AddPropertyForm />);
    
        // Wait for async actions and effects to complete
        await waitFor(() => {
          expect(logSpy).toHaveBeenCalledWith("User ID set:", "user123");
          // Uncomment the next line if you also want to check the rendered output
          // expect(getByTestId('userId').textContent).toBe('user123');
        });
    
        // Clean up the spy
        logSpy.mockRestore();
      });

    test('renders Add Property form', () => {
        render(<AddPropertyForm />);

        // Check if the form fields are rendered
        expect(screen.getByLabelText(/Property Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Year Built/i)).toBeInTheDocument();
        // Add assertions for other form fields

        // Check if the submit button is rendered
        expect(screen.getByRole('button', { name: /Register Property/i })).toBeInTheDocument();
    });

    test('submits form and adds property successfully', async () => {
        const mockRouter = {
            push: jest.fn(),
        };
        useRouter.mockReturnValue(mockRouter);

        const { getByLabelText, getByText } = render(<AddPropertyForm />);

        fireEvent.change(getByLabelText('Property Name'), { target: { value: 'Test Property' } });
        fireEvent.change(getByLabelText('Year Built'), { target: { value: '2022' } });
        fireEvent.change(getByLabelText(/Unit Count/i), { target: { value: '1' } });
        fireEvent.change(getByLabelText(/Province/i), { target: { value: 'Quebec' } });
        fireEvent.change(getByLabelText(/Parking Count/i), { target: { value: '2' } });
        fireEvent.change(getByLabelText(/Postal Code/i), { target: { value: 'J4Z 8F1' } });
        fireEvent.change(getByLabelText(/Locker Count/i), { target: { value: '3' } });
        fireEvent.change(getByLabelText(/Street/i), { target: { value: 'Alexander street' } });

        supabase.insert.mockResolvedValueOnce({ data: 'property_data' });

        fireEvent.click(getByText('Register Property'));

        await waitFor(() => {
            expect(supabase.insert).toHaveBeenCalledWith([
                {
                    buildingName: 'Test Property',
                    yearBuilt: '2022',
                    unitsCount: '1',
                    province: 'Quebec',
                    parkingCount: '2',
                    postalCode: 'J4Z 8F1',
                    lockerCount: '3',
                    street: 'Alexander street',
                    profileFky: null,    // null
                },
            ]);
            expect(mockRouter.push).toHaveBeenCalledWith('/profile');
            expect(console.log).toHaveBeenCalledWith('Successfully added property: ', 'property_data');

        });
    });

    test('handles errors during property addition', async () => {


        const errorMessage = 'Error adding property';
        supabase.insert.mockRejectedValueOnce(new Error(errorMessage));

        // Mocking router push function
        const mockRouter = {
            push: jest.fn(),
        };
        useRouter.mockReturnValue(mockRouter);

        // Mock window.alert
        const mockAlert = jest.fn();
        global.alert = mockAlert;

        const { getByLabelText, getByText } = render(<AddPropertyForm />);

        fireEvent.change(getByLabelText('Property Name'), { target: { value: 'Test Property' } });
        fireEvent.change(getByLabelText('Year Built'), { target: { value: '2022' } });
        // Add similar fireEvent calls for other form fields


        fireEvent.click(getByText('Register Property'));

        await waitFor(() => {
            // Check if error message is logged
            expect(console.error).toHaveBeenCalledWith('Error adding property:', 'Error adding property');

        });
    });
});
