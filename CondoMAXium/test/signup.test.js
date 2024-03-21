import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';

import supabase from '../config/supabaseClient';
import SignUp from '../pages/signup/index';

// Mock userRouter to push a new page
jest.mock('next/router', () => ({
    useRouter: jest.fn()
}))

// Mock supabase for backend
jest.mock('../config/supabaseClient', () => ({
  auth: {
    signUp: jest.fn(),
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

describe('SignUp Component', () => {

    // Clearing userRouter mock before each test
    beforeEach(() => {
        useRouter.mockClear();     
    });

    // Clearing all mocks after each test
    afterEach(() => {
        jest.clearAllMocks();
    });

    // This test is for the page in general
    test('renders the SignUp component without errors', () => {
        useRouter.mockReturnValue({ query: {}})
        render(<SignUp />); 
    });

    // This test is for most of the lines for the page
    test('submits form and signs up user successfully', async () => {
        // Mocking router push function
        const mockRouter = {
            push: jest.fn(),
        };
        useRouter.mockReturnValue(mockRouter);

        // Render the SignUp component
        const { getByTestId , getByText, getByRole } = render(<SignUp />);

        // Fill out form fields
        fireEvent.change(getByRole('textbox', { name: /First Name/i }), { target: { value: 'John' } });
        fireEvent.change(getByRole('textbox', { name: /Last Name/i }), { target: { value: 'Doe' } });
        fireEvent.change(getByRole('textbox', { name: /Email Address/i }), { target: { value: 'john.doe@example.com' } });
        fireEvent.change(getByTestId('pwd'), { target: { value: 'password123' } });

        // Mock successful sign-up response
        const signUpResponse = { data: 'mocked user data', error: null };
        supabase.auth.signUp.mockResolvedValueOnce(signUpResponse);

        // Act
        fireEvent.click(getByText('Sign Up'));

        // Assert
        await waitFor(() => {
            expect(supabase.auth.signUp).toHaveBeenCalledWith({
                email: 'john.doe@example.com',
                password: 'password123',
                options: {
                data: {
                    first_name: 'John',
                    last_name: 'Doe',
                },
                },
            });
            // Check if console error was called
            expect(console.error).not.toHaveBeenCalled();

            // Check if console log was called properly and successfully
            expect(console.log).toHaveBeenCalledWith('User signed up successfully:', 'mocked user data');
        });
    });

    // This test is for line(s): 106 (handleSubmit the catch)
    test('shows alert and logs error message if sign up fails due to rate limit exceeded', async () => {

        // Mocking 429 error (doesn't work)
        const mockedError = new Error('Email rate limit exceeded');
        mockedError.status = 429;
        supabase.auth.signUp.mockRejectedValueOnce(mockedError);
    
        // Mocking router push function
        const mockRouter = {
            push: jest.fn(),
        };
        useRouter.mockReturnValue(mockRouter);

        // Mock window.alert
        const mockAlert = jest.fn();
        global.alert = mockAlert;

        // Render the SignUp component
        const { getByTestId, getByRole, getByText } = render(<SignUp />);
    
        // Fill out form fields
        fireEvent.change(getByRole('textbox', { name: /First Name/i }), { target: { value: 'John' } });
        fireEvent.change(getByRole('textbox', { name: /Last Name/i }), { target: { value: 'Doe' } });
        fireEvent.change(getByRole('textbox', { name: /Email Address/i }), { target: { value: 'john.doe@example.com' } });
        fireEvent.change(getByTestId('pwd'), { target: { value: 'password123' } });

        // Act
        fireEvent.click(getByText('Sign Up'));

         // Assert: Wait for the async operations to finish
        await waitFor(() => {

            // Check if console.error was called
            expect(consoleErrorSpy).toHaveBeenCalledWith('Error signing up:', 'Email rate limit exceeded');

            // Check if console.log was not called
            expect(console.log).not.toHaveBeenCalled();

            // Assert that alert is shown with correct message
            // expect(mockAlert).toHaveBeenCalledWith('Error signing up: Email rate limit exceeded');

            // Check if router push function was not called
            // expect(mockRouter.push).not.toHaveBeenCalled();
        });
    });

});
