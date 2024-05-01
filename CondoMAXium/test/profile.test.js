import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ProfilePage from '../pages/profile/index';
import supabase from '../config/supabaseClient';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

const mockedStyles = {};
jest.mock('../styles/profile.module.css', () => ({
    ...mockedStyles,
}));

// mock next/router
jest.mock('next/router', () => ({
    useRouter: jest.fn().mockReturnValue({
        route: '/',
        pathname: '',
        query: '',
        asPath: '',
    }),
}));



// Mocking supabase
// Mock the supabase client module
jest.mock('../config/supabaseClient', () => ({
    auth: {
        getUser: jest.fn().mockResolvedValue({
            data: {
                user: { id: 'user123' },
            },
        }),
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
// Cleanup mocks after each test
afterEach(() => {
    jest.clearAllMocks();
});
describe('ProfilePage', () => {


    test('renders ProfilePage and loads user data', async () => {
        render( <ProfilePage />);

        await waitFor(() => expect(screen.getByText('Joe Doe')).toBeInTheDocument());

    });

    test('handles errors during data fetching', async () => {
        supabase.auth.getUser.mockResolvedValue({ error: { message: 'Error fetching user' }, data: null });
        render(
            <MemoryRouter>
                <ProfilePage />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText(/Error:/i)).toBeInTheDocument());
    });

    test('does not display phone for CMC role', async () => {
        supabase.from().select().eq().single.mockResolvedValue({ data: { roleOfUser: 'cmc' }, error: null });
        render(
            <MemoryRouter>
                <ProfilePage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.queryByText(/1234567890/i)).toBeNull(); // Phone number should not appear for 'cmc'
        });
    });

    test('renders ProfilePage and loads user data', async () => {
        render(
            <MemoryRouter>
                <ProfilePage />
            </MemoryRouter>
        );

        // Wait for the data to be loaded
        await waitFor(() => expect(supabase.auth.getUser).toHaveBeenCalledTimes(1));

        // Check if the profile data is displayed correctly
        expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
        expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
        expect(screen.getByText(/1234567890/i)).toBeInTheDocument(); // Phone number should appear
    });

    test('handles logout', async () => {
        render(<ProfilePage />);

        // Wait for the ProfilePage to render before locating the logout button
        await waitFor(() => expect(screen.getByText('Logout')).toBeInTheDocument());

        // Now find the logout button by its text content
        const logoutButton = screen.getByText('Logout');

        fireEvent.click(logoutButton);

        // Wait for the "You have been logged out" message to appear
        await waitFor(() => expect(screen.getByText(/You have been logged out/i)).toBeInTheDocument());
    });

});
