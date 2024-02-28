import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Dashboard from '../components/dashboard';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';

// Test to ensure essential elements are rendered in the dashboard
test('renders dashboard components', () => {
    render(<Router><Dashboard /></Router>);

    // Check if essential elements are rendered
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument(); // Check if the dashboard title is rendered
    expect(screen.getByLabelText(/open drawer/i)).toBeInTheDocument(); // Check if the open drawer button is rendered
    expect(screen.getByText(/property 1/i)).toBeInTheDocument(); // Check if property 1 is rendered
    expect(screen.getByText(/financial status/i)).toBeInTheDocument(); // Check if financial status is rendered
    expect(screen.getByText(/request status/i)).toBeInTheDocument(); // Check if request status is rendered
});

// Test navigation to different sections
test('navigates to different sections', () => {
    render(<Dashboard />);
    // Click on property link
    fireEvent.click(screen.getByText(/property 1/i));
    // Check if navigation occurs, for instance, if the details of property 1 are displayed
    expect(screen.getByText(/property details/i)).toBeInTheDocument();
});

// Test toggling drawer visibility
test('toggles drawer visibility', () => {
    render(<Dashboard />);

    // Find the button to close the drawer
    const chevronLeftIcon = screen.getByRole('button', { name: /close drawer/i });
    expect(chevronLeftIcon).toBeInTheDocument(); // Ensure the close drawer button is found

    // Click to close the drawer
    fireEvent.click(chevronLeftIcon);

    // Find the button to open the drawer
    const menuButton = screen.getByRole('button', { name: /open drawer/i });
    expect(menuButton).toBeInTheDocument(); // Ensure the open drawer button is found

    // Click to open the drawer
    fireEvent.click(menuButton);
    expect(screen.getByRole('button', { name: /close drawer/i })).toBeInTheDocument(); // Ensure the drawer is opened
});
