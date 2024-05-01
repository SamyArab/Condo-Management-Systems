import React from 'react';
import { render, screen, fireEvent, waitFor, useRouter } from '@testing-library/react';
import UserRequests from '../pages/requests-cmc/index';
import supabase from '../config/supabaseClient';
import '@testing-library/jest-dom';

// Mock the supabase client
jest.mock('../config/supabaseClient', () => ({
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockResolvedValue({ data: [{ id: 1, status: 'In Progress', assigned_to: 'User 1', user: 'user@email.com', subject: 'Description', type: 'WhatKind' }], error: null }),
  update: jest.fn().mockResolvedValue({ data: [], error: null })
}));

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

describe('UserRequests Component', () => {

    // Cleanup mocks after each test
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders without crashing', () => {
        render(<UserRequests />);
        expect(screen.getByText('All Requests')).toBeInTheDocument();
        expect(screen.getByLabelText('open drawer')).toBeInTheDocument();
    });
    
    test('renders table headers correctly', () => {
        render(<UserRequests />);
        const headers = ['User Email', 'Subject', 'Type', 'Assigned To', 'Status', 'Action'];
        headers.forEach(text => expect(screen.getByText(text)).toBeInTheDocument());
    });

    test('toggles drawer on menu icon click', () => {
        render(<UserRequests />);
        const openButton = screen.getByLabelText('open drawer');
        fireEvent.click(openButton);
        expect(screen.getByLabelText('close drawer')).toBeInTheDocument();
    });
      
    test('navigates to add request on button click', () => {
        render(<UserRequests />);
        const addButton = screen.getByText('Add Request');
        fireEvent.click(addButton);
        expect(mockPush).toHaveBeenCalledWith('/add-request');
    });

    test('displays data fetched from supabaseClient', async () => {
        render(<UserRequests />);

        // Wait for 5 seconds
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Wait for the component to finish rendering potentially asynchronous content
        await waitFor(() => {
            const userEmail = screen.getByText('user@email.com');
            expect(userEmail).toBeInTheDocument();
        
            const subject = screen.getByText('Description');
            expect(subject).toBeInTheDocument();
        
            const type = screen.getByText('WhatKind');
            expect(type).toBeInTheDocument();
        
            const assignedTo = screen.getByText('User 1');
            expect(assignedTo).toBeInTheDocument();
        
            const status = screen.getByText('In Progress');
            expect(status).toBeInTheDocument();

            const editButtons = screen.getAllByTestId("EditIcon");
            fireEvent.click(editButtons[0]);
        });
      }, 10000);
      
    test('edits and updates a request', async () => {
        render(<UserRequests />);

        // Wait for 5 seconds
        await new Promise(resolve => setTimeout(resolve, 5000));

        const editButtons = screen.getAllByTestId("EditIcon");
        fireEvent.click(editButtons[0]); // Click the edit button of the first request
        const updateButton = screen.getByText('Update');
        fireEvent.click(updateButton);
    }, 10000);

    test('update status', async () => {
        render(<UserRequests />);

        // Wait for 5 seconds
        await new Promise(resolve => setTimeout(resolve, 5000));

        const editButtons = screen.getAllByTestId("EditIcon");
        fireEvent.click(editButtons[0]); // Click the edit button of the first request

        // const selectInput = await screen.findByRole('button', { name: /status/i });
        // fireEvent.mouseDown(selectInput); // opens the dropdown
        // const statusInput = screen.getByRole('combobox');
        // fireEvent.change(statusInput, { target: { value: 'Resolved' } });

        const textInput = screen.getByRole('textbox', {name: ''});
        fireEvent.change(textInput, {target: {value: 'Nick'}});

        expect(textInput.value).toBe('Nick');

        const updateButton = screen.getByText('Update');
        fireEvent.click(updateButton);

        // expect(selectInput.textContent).toBe('In Progress');
       
    }, 10000);
      
      
      
      
});
