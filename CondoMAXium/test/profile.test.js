import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ProfilePage from '../pages/profile/index';
import supabase from '../config/supabaseClient';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mocked user email
const userEmail = 'test@example.com';

// Mock supabase responses
const mockUserWithEmail = { data: { user: { email: userEmail, id: 'user123' } } };
const mockUserNoEmail = { data: { user: { id: 'user123' } } };
const mockProfileError = new Error('Error fetching profile data: User email not found; User might not be logged in.');

jest.mock('../config/supabaseClient', () => ({
    auth: {
        getUser: jest.fn().mockImplementation((email) => {
            if (email === userEmail) {
                return Promise.resolve(mockUserWithEmail);
            } else {
                return Promise.resolve(mockUserNoEmail);
            }
        }),
        signOut: jest.fn().mockResolvedValue({ error: null }),
    },
    from: () => ({
        select: () => ({
            eq: () => ({
                data: [
                    {
                        email: 'test@example.com',
                        name: 'John Doe',
                        phone: '123456789',
                    },
                ],
                error: null,
            }),
        }),
    }),
}));

// Mocked CSS styles
const mockedStyles = {};
jest.mock('../styles/profile.module.css', () => ({
    ...mockedStyles,
}));

// Mock next/router
jest.mock('next/router', () => ({
    useRouter: jest.fn().mockReturnValue({
        route: '/',
        pathname: '',
        query: '',
        asPath: '',
    }),
}));

// Cleanup mocks after each test
afterEach(() => {
    jest.clearAllMocks();
});

describe('ProfilePage', () => {
    test('renders ProfilePage with user data', async () => {
        render(
            <MemoryRouter>
                <ProfilePage />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument());
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
        expect(screen.getByText('123456789')).toBeInTheDocument();
    });

    test('handles logout', async () => {
        render(
            <MemoryRouter>
                <ProfilePage />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText('Logout')).toBeInTheDocument());

        const logoutButton = screen.getByText('Logout');
        fireEvent.click(logoutButton);

        await waitFor(() => expect(supabase.auth.signOut).toHaveBeenCalledTimes(1));
    });

    test('displays loading spinner while fetching data', async () => {
        render(
            <MemoryRouter>
                <ProfilePage />
            </MemoryRouter>
        );

        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
        await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument());
        expect(screen.queryByTestId('loading-spinner')).toBeNull();
    });

    test('displays error message if data fetching fails', async () => {
        supabase.auth.getUser.mockRejectedValue(new Error('Error fetching user'));

        render(
            <MemoryRouter>
                <ProfilePage />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText('Error: Error fetching user')).toBeInTheDocument());
    });

    test('displays correct profile information for owner role', async () => {
        // Mock supabase response for owner role and verify profile information
    });

    test('displays correct profile information for tenant role', async () => {
        // Mock supabase response for tenant role and verify profile information
    });

    test('displays correct profile information for cmc role', async () => {
        // Mock supabase response for cmc role and verify profile information
    });

    test('fetches user role and profile data and sets user object for owner role', async () => {
        render(
            <MemoryRouter>
                <ProfilePage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(supabase.auth.getUser).toHaveBeenCalledTimes(1);
            expect(supabase.from().select().eq().single).toHaveBeenCalledTimes(1);
            expect(supabase.from().select().eq().single().eq().select().eq().mock.calls[0][1]).toEqual(userEmail);
        });
    });
});
