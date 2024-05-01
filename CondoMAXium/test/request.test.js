import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import UserRequests from '../pages/requests/index'; //path
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('next/router', () => ({
    useRouter: jest.fn().mockImplementation(() => ({
        push: jest.fn(), 
    }))
}));

const mockPush = jest.fn();
jest.mock('next/router', () => ({
    useRouter: jest.fn().mockImplementation(() => ({
        push: mockPush,
    })),
}));


jest.mock("../config/supabaseClient", () => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: { email: "user@example.com" }},
        error: null
      }),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({
        data: [
          { subject: "Leaky Faucet", type: "Maintenance", assigned_to: "John Doe", status: "In Progress" },
          { subject: "Parking Dispute", type: "Complaint", assigned_to: "Jane Smith", status: "Open" }
        ],
        error: null
      }),
    })),
  }));

// Cleanup mocks after each test
afterEach(() => {
    jest.clearAllMocks();
});

// // Test to ensure essential elements are rendered in the dashboard
// test('renders request page', async () => {
//     render(<UserRequests />);

//     // Check if essential elements are rendered
//     await waitFor(()=> {
//         expect(screen.getByText('Subject 1')).toBeInTheDocument(); // Check if the dashboard title is rendered
//         expect(screen.getByText('Type 1')).toBeInTheDocument(); // Check if the open drawer button is rendered
//         expect(screen.getByText('User 1')).toBeInTheDocument(); // Check if property 1 is rendered
//         expect(screen.getByText('Resolved')).toBeInTheDocument(); // Check if financial status is rendered
//     });
// });

test('renders requests dynamically based on fetched data', async () => {
    render(<UserRequests />);
    await screen.findByText('Leaky Faucet');
    await screen.findByText('Parking Dispute');
  
    const leakyFaucetType = screen.getByText('Maintenance');
    expect(leakyFaucetType).toBeInTheDocument();
  
    const status = screen.getAllByText('In Progress');
    expect(status[0]).toBeInTheDocument();
});

// Test toggling drawer visibility
test('toggles drawer visibility', async () => {
    render(<UserRequests />);

    await waitFor(()=> {
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
});

test('should navigate to "/add-request" after clicking "Add Request"', async () => {
    // Render the UserRequests component
    render(<UserRequests />);

    await waitFor(()=> {
    // Find the "Add Request" button and click it
    const addButton = screen.getByText('Add Request');
    fireEvent.click(addButton);

    // Check if useNavigate was called with the correct path
    expect(mockPush).toHaveBeenCalledWith('/add-request');
    });
});


