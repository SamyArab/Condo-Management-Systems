import React from 'react';
import { render, fireEvent, screen, waitFor, userEvent, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useRouter } from "next/router";
import Dashboard from '../pages/dashboard/index';
import supabase from '../config/supabaseClient';
import '@testing-library/jest-dom';

// // Directly in your test file
// jest.mock('next/router', () => ({
//     useRouter() {
//       return {
//         push: jest.fn(),
//       };
//     },
//   }));

// Mocking the Next.js router
jest.mock('next/router', () => ({
    useRouter: jest.fn()
}));


jest.mock('../config/supabaseClient', () => ({
  auth: {
    getUser: jest.fn().mockResolvedValue({
      data: { user: { email: 'test@example.com' } },
      error: null
    }),
  },
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockResolvedValue({
      data: [
        { id: 1, 
            property_name: 'Highrise', 
            unit_number: '101', 
            emailUnit: 'test@example.com',
            occupied_by: 'Tenant',
            first_name_tenant: 'John',
            last_name_tenant: 'Doe',
            tenant_email: 'johndoe@example.com',
            tenant_phone: '123-456-7890'
        },
        // Add more mock units as necessary
      ],
      error: null
    }),
  })),
}));

describe('Dashboard Component', () => {
  test('renders Dashboard component', () => {
    render(<Dashboard />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Add Property')).toBeInTheDocument();
  });

  test('renders and interacts with the drawer', async () => {
    render(<Dashboard />);
    const openDrawerButton = screen.getByLabelText('open drawer');
    fireEvent.click(openDrawerButton);
    await waitFor(() => expect(screen.getByText('Dashboard')).toBeInTheDocument());
    const closeDrawerButton = screen.getByLabelText('close drawer');
    fireEvent.click(closeDrawerButton);
  });
  
  test('navigation using list items', async () => {
    render(<Dashboard />);

    // Wait for 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));

    const listItem = screen.getByText('Highrise');
    fireEvent.click(listItem);
    // This should set the selected unit, test that this has happened
    expect(screen.getByText('Property: Highrise')).toBeInTheDocument();
  }, 10000);
  
  test('displays detailed unit information upon selection', async() => {
    render(<Dashboard />);

    // Wait for 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));

    const unitItem = screen.getByText('Highrise');
    fireEvent.click(unitItem);
    const seeMoreLink = screen.getByText('See More');
    fireEvent.click(seeMoreLink);
    expect(screen.getByText('Unit Owner:')).toBeInTheDocument();

  }, 10000);

  test('navigates to the add-property page on click', () => {
    const pushMock = jest.fn();
    useRouter.mockImplementation(() => ({
      push: pushMock
    }));

    const { getByLabelText } = render(<Dashboard />);
    const addPropertyButton = getByLabelText('add property');
    fireEvent.click(addPropertyButton);

    expect(pushMock).toHaveBeenCalledWith('/add-property');
  });
  
  test('displays tenant information when occupied by a tenant', async() => {

    render(<Dashboard/>); // Assume Dashboard can take selectedUnit as a prop for testing

    // Wait for 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));

    const seeMoreLink = screen.getByText('See More');
    fireEvent.click(seeMoreLink);

    expect(screen.getByText(/Occupied by: Tenant/i)).toBeInTheDocument();
    expect(screen.getByText(/Tenant Name: John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Tenant Email: johndoe@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Tenant Phone: 123-456-7890/i)).toBeInTheDocument();
  }, 10000);
  
});

  