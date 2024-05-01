import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Header from '../components/layout/Header';
import supabase from '../config/supabaseClient';

// Correctly mock the supabase client to return the expected data structure
jest.mock('../config/supabaseClient', () => ({
    auth: {
        getUser: jest.fn()
    },
    from: jest.fn(() => ({
        select: jest.fn(() => ({
            eq: jest.fn(() => ({
                single: jest.fn(() => Promise.resolve({ data: { roleOfUser: 'owner' } }))
            }))
        }))
    }))
}));

// Mock global window location
const mockLocation = jest.spyOn(window, 'location', 'get');
mockLocation.mockReturnValue({
    href: '',
    assign: jest.fn()
});

describe('Header', () => {
    beforeEach(() => {
        // Ensure that getUser mock is setup to always return a user object with email
        supabase.auth.getUser.mockResolvedValue({ data: { user: { email: 'user@example.com' } } });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('fetches role if user is present', async () => {
        render(<Header />);
        await waitFor(() => {
            expect(supabase.auth.getUser).toHaveBeenCalled();
            expect(supabase.from().select().eq().single).toHaveBeenCalled();
        });
        expect(screen.getByText('CondoMAXium')).toBeInTheDocument();
    });

    test('does not fetch role if user is absent', async () => {
        // Mock getUser to return no user data
        supabase.auth.getUser.mockResolvedValueOnce({ data: { user: null } });
        render(<Header />);
        await waitFor(() => {
            expect(supabase.auth.getUser).toHaveBeenCalled();
            expect(supabase.from().select().eq().single).not.toHaveBeenCalled();
        });
    });

    test('renders correctly', () => {
        const { getByText } = render(<Header />);
        expect(getByText('CondoMAXium')).toBeInTheDocument();
    });

    test('opens and closes the navigation menu', async () => {
        render(<Header />);
        fireEvent.click(screen.getByLabelText('menu'));
        expect(screen.getByText('Dashboard')).toBeVisible();
        fireEvent.click(screen.getByText('Dashboard'));
        await waitFor(() => expect(screen.queryByText('Dashboard')).not.toBeInTheDocument());
    });

    test('navigates based on user role', async () => {
        render(<Header />);
        fireEvent.click(screen.getByLabelText('menu'));
        fireEvent.click(screen.getByText('Dashboard'));
        await waitFor(() => {
            expect(window.location.assign).toHaveBeenCalledWith('/dashboard');
        });

        // Changing the role to cmc and testing the navigation
        supabase.from().select().eq().single.mockResolvedValueOnce({ data: { roleOfUser: 'cmc' } });
        render(<Header />);
        fireEvent.click(screen.getByLabelText('menu'));
        fireEvent.click(screen.getByText('Dashboard'));
        await waitFor(() => {
            expect(window.location.assign).toHaveBeenCalledWith('/dashboardCMC');
        });
    });
});
