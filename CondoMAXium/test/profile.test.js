import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ProfilePage from '../pages/profile/index';
import supabase from '../config/supabaseClient';
import { BrowserRouter as Router } from 'react-router-dom';

// Mocking supabase
jest.mock('../config/supabaseClient', () => ({
    auth: {
        getUser: jest.fn()
    },
    from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn()
    }))
}));

const mockUser = {
    user: {
        email: 'test@example.com'
    },
    data: {
        user: {
            email: 'test@example.com'
        }
    },
    error: null
};

const mockProfileData = {
    data: [{ first_name: "John", last_name: "Doe", phone: "1234567890" }],
    error: null
};

const mockRoleData = {
    data: { roleOfUser: 'owner' },
    error: null
};

const mockUnitData = {
    data: [{ owner_phone: "1234567890" }],
    error: null
};

describe('ProfilePage', () => {
    beforeEach(() => {
        supabase.auth.getUser.mockResolvedValue(mockUser);
        supabase.from().select().eq().single.mockResolvedValue(mockRoleData);
        supabase.from().select().eq.mockResolvedValue(mockProfileData);
        supabase.from().select().eq.mockResolvedValue(mockUnitData);
    });

    test('renders ProfilePage and loads user data', async () => {
        render(<Router><ProfilePage /></Router>);

        await waitFor(() => expect(supabase.auth.getUser).toHaveBeenCalledTimes(1));
        expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
        expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
        expect(screen.getByText(/1234567890/i)).toBeInTheDocument(); // Phone number should appear for 'owner'
    });

    test('handles errors during data fetching', async () => {
        supabase.auth.getUser.mockResolvedValue({ error: { message: 'Error fetching user' }, data: null });
        render(<Router><ProfilePage /></Router>);

        await waitFor(() => expect(screen.getByText(/Error:/i)).toBeInTheDocument());
    });

    test('does not display phone for CMC role', async () => {
        supabase.from().select().eq().single.mockResolvedValue({ data: { roleOfUser: 'cmc' }, error: null });
        render(<Router><ProfilePage /></Router>);

        await waitFor(() => {
            expect(screen.queryByText(/1234567890/i)).toBeNull(); // Phone number should not appear for 'cmc'
        });
    });

    test('handles logout', async () => {
        render(<Router><ProfilePage /></Router>);

        const logoutButton = screen.getByRole('button', { name: /logout/i });
        fireEvent.click(logoutButton);
        await waitFor(() => expect(screen.getByText(/You have been logged out/i)).toBeInTheDocument());
    });
});
