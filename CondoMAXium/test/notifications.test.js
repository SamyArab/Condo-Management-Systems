import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { BrowserRouter as Router } from 'react-router-dom';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import supabase from '../config/supabaseClient';
import NotificationsPage from '../pages/notifications/index';

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
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

// Mock window.alert
const mockAlert = jest.fn();
global.alert = mockAlert;

// Mock console.log to do nothing
console.log = jest.fn();

describe('NotificationsPage Component', () => {

    // Clearing useRouter mock before each test
    beforeEach(() => {
        useRouter.mockClear();
    });

    // Clearing all mocks after each test
    afterEach(() => {
        jest.clearAllMocks();
    });

    // This test is for the page in general
    test('renders the NotificationsPage component without errors', () => {
        useRouter.mockReturnValue({ query: {} })
        render(<NotificationsPage />);
    });

    // test('show details section when notification is clicked', async () => {
    //     const { getByPlaceholderText, getByText } = render(
    //         <Router>
    //             <NotificationsPage />
    //         </Router>
    //     );
    //     const selectButton = getByPlaceholderText('Select Notification');

    //     fireEvent.click(selectButton);
    //     await waitFor(() => {
    //         expect(getByText('From:')).toBeInTheDocument();
    //     });
    // });

    test('handles error in fetching notification query', async () => {
        //const error = new Error('Error fetching units');
        render(
            <Router>
                <NotificationsPage />
            </Router>
        );
        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith('Error fetching notifications: ','_supabaseClient.default.auth.getUser is not a function');
        });
    });

    
    // test('handles error in fetching user query', async () => {
    //     //const error = new Error('Error fetching units');
    //     render(
    //         <Router>
    //             <NotificationsPage />
    //         </Router>
    //     );
    //     await waitFor(() => {
    //         expect(console.error).toHaveBeenCalledWith('Error fetching user: ','_supabaseClient.default.auth.getUser is not a function');
    //     });
    // });


});
