import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Dashboard from '../pages/dashboard/index';
import supabase from '../config/supabaseClient'; // Import supabase object
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('next/router', () => ({
    useRouter: jest.fn()
}));

jest.mock('../config/supabaseClient', () => ({
    auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { email: 'test@example.com' } } })
    },
    from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        then: jest.fn()
    }))
}));

// Cleanup mocks after each test
afterEach(() => {
    jest.clearAllMocks();
});

describe('Dashboard Component', () => {
    test('renders dashboard components', async () => {
        render(
            <Router>
                <Dashboard />
            </Router>
        );

        // Assertions for initial rendering
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByLabelText('Open Drawer')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Search')).toBeInTheDocument(); // Assuming there is a search input with a placeholder text
    });

    test('toggles drawer visibility', async () => {
        render(
            <Router>
                <Dashboard />
            </Router>
        );

        // Wait for the element to appear
        await waitFor(() => {
            expect(screen.getByLabelText('Open Drawer')).toBeInTheDocument();
        });

        const chevronLeftIcon = screen.getByRole('button', { name: /close drawer/i });
        expect(chevronLeftIcon).toBeInTheDocument();
        fireEvent.click(chevronLeftIcon);
        const menuButton = screen.getByRole('button', { name: /open drawer/i });
        expect(menuButton).toBeInTheDocument();
        fireEvent.click(menuButton);
        expect(screen.getByRole('button', { name: /close drawer/i })).toBeInTheDocument();
    });

    test('handles error in supabase query', async () => {
        const mockError = new Error('Error fetching units');
        jest.spyOn(supabase, 'from').mockImplementation(() => ({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            then: jest.fn().mockRejectedValue(mockError)
        }));

        render(
            <Router>
                <Dashboard />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText(`Error fetching units: ${mockError.message}`)).toBeInTheDocument();
        });
    });

    test('navigates to profile page', async () => {
        const pushMock = jest.fn();
        jest.spyOn(require('next/router'), 'useRouter').mockReturnValue({
            push: pushMock
        });

        render(
            <Router>
                <Dashboard />
            </Router>
        );

        fireEvent.click(screen.getByLabelText('Profile'));
        expect(pushMock).toHaveBeenCalledWith('/profile');
    });

    test('toggles drawer visibility', () => {
        render(
            <Router>
                <Dashboard />
            </Router>
        );

        const chevronLeftIcon = screen.getByRole('button', { name: /close drawer/i });
        expect(chevronLeftIcon).toBeInTheDocument();
        fireEvent.click(chevronLeftIcon);
        const menuButton = screen.getByRole('button', { name: /open drawer/i });
        expect(menuButton).toBeInTheDocument();
        fireEvent.click(menuButton);
        expect(screen.getByRole('button', { name: /close drawer/i })).toBeInTheDocument();
    });

    test('toggles more info section when "See More" is clicked', async () => {
        render(
            <Router>
                <Dashboard />
            </Router>
        );

        fireEvent.click(screen.getByText('See More'));
        await waitFor(() => {
            expect(screen.getByText('Placeholder Unit Owner: Placeholder Owner Name')).toBeInTheDocument();
        });
    });

    test('handles empty data from supabase', async () => {
        const mockSupabaseResponse = { data: [], error: null };
        jest.spyOn(supabase, 'from').mockReturnValueOnce(mockSupabaseResponse);

        render(
            <Router>
                <Dashboard />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText('No units available')).toBeInTheDocument();
        });
    });

    test('handles error during data fetching', async () => {
        const mockError = new Error('Error fetching user');
        jest.spyOn(supabase, 'from').mockRejectedValueOnce(mockError);

        render(
            <Router>
                <Dashboard />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText(`Error fetching units: ${mockError.message}`)).toBeInTheDocument();
        });
    });

    test('renders loading state when fetching data', async () => {
        render(
            <Router>
                <Dashboard />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByTestId('loading-state')).toBeInTheDocument();
        });
    });

    test('renders footer', async () => {
        render(
            <Router>
                <Dashboard />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText(/condomaxium/i)).toBeInTheDocument();
            expect(screen.getByText(/copyright/i)).toBeInTheDocument();
        });
    });

    test('renders the Dashboard component without errors', async () => {
        render(
            <Router>
                <Dashboard />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText('Dashboard')).toBeInTheDocument();
            expect(screen.getByText('Placeholder Property: Placeholder Property Name')).toBeInTheDocument();
            expect(screen.getByText('Placeholder Unit Number: Placeholder Unit Number')).toBeInTheDocument();
        });
    });
});
