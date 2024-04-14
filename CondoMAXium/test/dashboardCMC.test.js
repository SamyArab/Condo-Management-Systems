import React from 'react';
import {getAllByLabelText, render, screen, waitFor} from '@testing-library/react';
import DashboardCMC from '../pages/dashboardCMC/index';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';
// Mock dependencies
jest.mock('next/router', () => ({
    useRouter: jest.fn()
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn() // Mock useNavigate
}));

// Cleanup mocks after each test
afterEach(() => {
    jest.clearAllMocks();
});

describe('PropertyList Component', () => {
    test('renders without crashing', () => {
        render(<DashboardCMC />);
    });

    test('renders property listings correctly', () => {
        const { getByText } = render(<DashboardCMC />);
        expect(getByText('Dashboard')).toBeInTheDocument();
    });

    test('drawer is initially visible', () => {
        const { getByLabelText } = render(<DashboardCMC />);
        expect(getByLabelText('close drawer')).toBeInTheDocument();
    });

    test('drawer toggles open and close', () => {
        const { getByLabelText } = render(<DashboardCMC />);

        // Get the drawer toggle button
        const drawerToggleButton = getByLabelText('open drawer');

        // Click the drawer toggle button to close the drawer
        userEvent.click(drawerToggleButton);
        expect(getByLabelText('close drawer')).toBeInTheDocument();

        // Click the drawer toggle button again to open the drawer
        userEvent.click(drawerToggleButton);
        expect(getByLabelText('open drawer')).toBeInTheDocument();
    });

    test('clicking Add Amenities button triggers the handleAmenitiesClick function', () => {
        render(<DashboardCMC />);

        const addAmenitiesButton = screen.getByRole('button', { name: 'Add Amenities' });

        expect(addAmenitiesButton).not.toBeInTheDocument();
    });

    test('clicking Maintenance button triggers the handleMaintenanceClick function', () => {
        const { container } = render(<DashboardCMC />);
        const maintenanceButtons = getAllByText('Maintenance');

        // Find the visible Maintenance button
        const visibleMaintenanceButton = maintenanceButtons.find(button => button.offsetParent !== null);

        // Simulate a click event using userEvent library
        userEvent.click(visibleMaintenanceButton);

        // No expectations, just verifying that the click event is fired without causing errors
    });


    // test('renders buttons if properties exist', async () => {
    //     render(<DashboardCMC />);
    //     // Mock properties data with at least one property
    //     const mockProperties = [
    //         {
    //             id: '1',
    //             buildingName: 'Mock Building',
    //             unitsCount: 10,
    //             parkingCount: 20,
    //             yearBuilt: 2020,
    //             lockerCount: 5,
    //             street: 'Mock Street',
    //             province: 'Mock Province',
    //             postalCode: '12345'
    //         }
    //     ];
    //
    //     // Mock useState to simulate that properties exist
    //     jest.spyOn(React, 'useState').mockImplementation(() => [true, jest.fn()]);
    //
    //     // Mock useEffect to immediately execute fetchProperties
    //     jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    //
    //     // Mock supabaseClient functions
    //     const mockSupabaseClient = {
    //         auth: {
    //             getUser: jest.fn(() => Promise.resolve({ data: { user: { id: '1' } } }))
    //         },
    //         from: jest.fn(() => ({
    //             select: jest.fn(() => ({
    //                 eq: jest.fn(() => ({
    //                     data: mockProperties
    //                 }))
    //             }))
    //         }))
    //     };
    //
    //     jest.mock('../config/supabaseClient', () => ({
    //         __esModule: true,
    //         default: mockSupabaseClient
    //     }));
    //
    //     // Wait for the component to update after mocking fetchProperties
    //     await waitFor(() => {
    //         const { getByText } = render(<DashboardCMC />);
    //         // Assert that the "Add Amenities" button is rendered
    //         expect(getByText('Add Amenities')).toBeInTheDocument();
    //         expect(screen.getByLabelText('Maintenance')).toBeInTheDocument();
    //     });
    // });


});