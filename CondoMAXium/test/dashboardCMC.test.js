import React from 'react';
import { render } from '@testing-library/react';
import DashboardCMC from '../pages/dashboardCMC/index';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

describe('PropertyList Component', () => {
    test('renders without crashing', () => {
        render(<DashboardCMC />);
    });

    test('renders property listings correctly', () => {
        const { getByText } = render(<DashboardCMC />);
        expect(getByText('Property Listings')).toBeInTheDocument();
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
        const { getAllByText } = render(<DashboardCMC />);
        const addAmenitiesButtons = getAllByText('Add Amenities');

        // Find the visible Add Amenities button
        const visibleAddAmenitiesButton = addAmenitiesButtons.find(button => button.offsetParent !== null);

        // Simulate a click event using userEvent library
        userEvent.click(visibleAddAmenitiesButton);

        // No expectations, just verifying that the click event is fired without causing errors
    });

    test('clicking Maintenance button triggers the handleMaintenanceClick function', () => {
        const { getAllByText } = render(<DashboardCMC />);
        const maintenanceButtons = getAllByText('Maintenance');

        // Find the visible Maintenance button
        const visibleMaintenanceButton = maintenanceButtons.find(button => button.offsetParent !== null);

        // Simulate a click event using userEvent library
        userEvent.click(visibleMaintenanceButton);

        // No expectations, just verifying that the click event is fired without causing errors
    });
});
