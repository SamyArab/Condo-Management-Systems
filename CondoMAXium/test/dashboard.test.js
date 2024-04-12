import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Dashboard from '../pages/dashboard/index';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('next/router', () => ({
    useRouter: jest.fn()
}));

// Mock useNavigate
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        ...originalModule,
        useNavigate: jest.fn()
    };
});

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

        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByLabelText('Open Drawer')).toBeInTheDocument();
        expect(screen.getByText('Property 1')).toBeInTheDocument();
    });

    test('navigates to different sections', () => {
        render(
            <Router>
                <Dashboard />
            </Router>
        );
        fireEvent.click(screen.getByText(/property 1/i));
        expect(screen.getByText(/property details/i)).toBeInTheDocument();
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

    test('should navigate to "/addproperty" after clicking "Add Property"', async () => {
        render(
            <Router>
                <Dashboard />
            </Router>
        );
        const addButton = screen.getByText('Add Property');
        fireEvent.click(addButton);
        expect(require('react-router-dom').useNavigate).toHaveBeenCalledWith();
    });

    test('toggles more info section when "See More" is clicked', async () => {
        const { getByText } = render(
            <Router>
                <Dashboard />
            </Router>
        );
        fireEvent.click(getByText('See More'));
        await waitFor(() => {
            expect(getByText('Unit Owner:')).toBeInTheDocument();
        });
    });

    test('handles error in supabase query', async () => {
        const error = new Error('Error fetching units');
        render(
            <Router>
                <Dashboard />
            </Router>
        );
        await waitFor(() => {
            expect(screen.getByText('Error fetching units: Error fetching units')).toBeInTheDocument();
        });
    });

    test('handles empty data from supabase', async () => {
        const mockSupabaseResponse = { data: [], error: null };
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
        const error = new Error('Error fetching user');
        render(
            <Router>
                <Dashboard />
            </Router>
        );
        await waitFor(() => {
            expect(screen.getByText('Error fetching units: Error fetching user')).toBeInTheDocument();
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

    test('renders the Dashboard component without errors', async () => {
        const { getByText } = render(
            <Router>
                <Dashboard />
            </Router>
        );
        await waitFor(() => {
            expect(getByText('Dashboard')).toBeInTheDocument();
            expect(getByText('Test Property')).toBeInTheDocument();
            expect(getByText('123')).toBeInTheDocument();
        });
    });
});

