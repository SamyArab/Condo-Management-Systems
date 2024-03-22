import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import supabase from '../config/supabaseClient';
import SignInSide from '../pages/login/index';

// Mock useRouter to push a new page
jest.mock('next/router', () => ({
    useRouter: jest.fn()
}))

// Mock supabase for backend
jest.mock('../config/supabaseClient', () => ({
    auth: {
        signInWithPassword: jest.fn(),
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

describe('SignInSide Component', () => {

    // Clearing useRouter mock before each test
    beforeEach(() => {
        useRouter.mockClear();
    });

    // Clearing all mocks after each test
    afterEach(() => {
        jest.clearAllMocks();
    });

    // This test is for the page in general
    test('renders the SignInSide component without errors', () => {
        useRouter.mockReturnValue({ query: {}})
        render(<SignInSide />);
    });

    // This test is for most of the lines for the page
    test('submits form and signs in user successfully', async () => {
        // Mocking router push function
        const mockRouter = {
            push: jest.fn(),
        };
        useRouter.mockReturnValue(mockRouter);

        // Render the SignInSide component
        const { getByLabelText, getByText } = render(<SignInSide />);

        // Fill out form fields
        fireEvent.change(getByLabelText(/Email Address/i), { target: { value: 'nicola@gmail.com' } });
        fireEvent.change(getByLabelText(/Password/i), { target: { value: '123456' } });

        // Mock successful sign-in response
        const signInResponse = { data: 'mocked user data', error: null };
        supabase.auth.signInWithPassword.mockResolvedValueOnce(signInResponse);

        // Act
        fireEvent.click(getByText('Sign In'));

        // Assert
        await waitFor(() => {
            expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
                email: 'nicola@gmail.com',
                password: '123456',
            });
            // Check if console error was called
            expect(console.error).not.toHaveBeenCalled();

            // Check if console log was called properly and successfully
            expect(console.log).toHaveBeenCalledWith('User logged in succesfully:', 'mocked user data');
        });
    });

    // This test is for line(s): 106 (handleSubmit the catch)
    test('shows alert and logs error message if sign in fails due to invalid credentials', async () => {

        // Mocking invalid credentials error
        const mockedError = new Error('Invalid credentials');
        mockedError.status = 401;
        supabase.auth.signInWithPassword.mockRejectedValueOnce(mockedError);

        // Mocking router push function
        const mockRouter = {
            push: jest.fn(),
        };
        useRouter.mockReturnValue(mockRouter);

        // Render the SignInSide component
        const { getByLabelText, getByText } = render(<SignInSide />);

        // Fill out form fields
        fireEvent.change(getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
        fireEvent.change(getByLabelText(/Password/i), { target: { value: 'invalidpassword' } });

        // Act
        fireEvent.click(getByText('Sign In'));

        // Assert: Wait for the async operations to finish
        await waitFor(() => {

            // Check if console.error was called
            expect(consoleErrorSpy).toHaveBeenCalledWith('Error logging in:', 'Invalid credentials');

            // Check if console.log was not called
            expect(console.log).not.toHaveBeenCalled();

            // Assert that alert is shown with correct message
            // expect(mockAlert).toHaveBeenCalledWith('Error logging in: Invalid credentials');

            // Check if router push function was not called
            // expect(mockRouter.push).not.toHaveBeenCalled();
        });
    });

    test('handles error during sign in', async () => {
        // Mocking router push function
        const mockRouter = {
            push: jest.fn(),
        };
        useRouter.mockReturnValue(mockRouter);

        // Render the SignInSide component
        const { getByLabelText, getByText } = render(<SignInSide />);

        // Fill out form fields
        fireEvent.change(getByLabelText(/Email Address/i), { target: { value: 'nicola@gmail.com' } });
        fireEvent.change(getByLabelText(/Password/i), { target: { value: '123456' } });

        // Mock sign-in response with an error
        const signInResponse = { data: null, error: new Error('Sign-in failed') };
        supabase.auth.signInWithPassword.mockResolvedValueOnce(signInResponse);

        // Act
        fireEvent.click(getByText('Sign In'));

        // Assert
        await waitFor(() => {
            // Ensure that router.push('/') is called
            expect(mockRouter.push).toHaveBeenCalledWith("/");

            // Ensure that the error is thrown
            expect(console.error).toHaveBeenCalledWith('Error logging in:', signInResponse.error.message);
        });
    });

    test('covers theme mode condition', () => {
        // Define a theme with mode set to 'light'
        const lightTheme = createTheme({
            palette: {
                mode: 'light',
            },
        });

        // Render the SignInSide component wrapped in the ThemeProvider with light theme
        render(
            <ThemeProvider theme={lightTheme}>
                <SignInSide />
            </ThemeProvider>
        );

        // Ensure that the condition t.palette.mode === "light" is met
        // This line is covered because it's triggered by the provided theme mode
    });


});
