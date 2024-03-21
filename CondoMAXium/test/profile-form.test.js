import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import ProfileForm from '../pages/profile-form/index';


// Mock CSS module content
const mockedStyles = {};

jest.mock('../styles/profileForm.module.css', () => ({
  ...mockedStyles,
}));

// Mock console.error to throw an error
console.error = jest.fn().mockImplementation(() => {
    throw new Error('console.error called');
});

// Mock window.alert
const mockAlert = jest.fn();
global.alert = mockAlert;

// Mock console.log to do nothing
console.log = jest.fn();

describe('ProfileForm Component', () => {

    // This test is for the page in general
    test('renders ProfileForm component', () => {
        // Render the ProfileForm component
        render(<ProfileForm />);
        expect(screen.getByText('Profile Information')).toBeInTheDocument();
    });
  
    // This test is for most of the lines for the page
    test('submits the form with valid data', async () => {
        // Render the ProfileForm component
        const { getByTestId, getAllByTestId, getByRole, getAllByRole } =render(<ProfileForm />);
  
        // Fill out the form fields
        fireEvent.change(getByRole('textbox', { name: /First Name/i }), { target: { value: 'John' } });
        fireEvent.change(getByRole('textbox', { name: /Last Name/i }), { target: { value: 'Doe' } });
        fireEvent.change(getByRole('textbox', { name: /Phone Number/i }), { target: { value: '1234567890' } });
        fireEvent.change(getByTestId('CMC-select', { name: /CMC/i }), { target: { value: 'test' } });
        fireEvent.change(getByTestId('type-select', { name: /type/i }), { target: { value: 'Owner' } });
        fireEvent.change(getAllByRole('textbox', { name: /Building Name/i })[0], { target: { value: 'Building A' } });
        fireEvent.change(getAllByRole('textbox', { name: /Unit Number/i })[0], { target: { value: '101' } });
        fireEvent.change(getAllByRole('textbox', { name: /Owners Full Name/i })[0], { target: { value: 'John Doe' } });
        fireEvent.change(getAllByTestId('occupant-select', { name: /occupant/i })[0], { target: { value: 'The owner' } });
        fireEvent.change(getAllByRole('textbox', { name: /Size/i })[0], { target: { value: '1000' } });
  
        // Submit the form
        fireEvent.click(screen.getByText('Submit'));
    
        // Wait for the dialog to appear
        await waitFor(() => {
            expect(screen.getByText("Don't Worry!")).toBeInTheDocument();
        });

        // Close dialogue
        fireEvent.click(screen.getByText('OK'));

        // Wait for the dialog to disappear
        await waitFor(() => {
            expect(screen.queryByText("Don't Worry!")).toBeNull();
        });
    }, 15000); // Increase the timeout to 15000ms (15 seconds)

    // This test is for line(s): 100 (handleFieldsChange first if)
    test('allows numeric input for unitId and unitSize fields', () => {
        // Render the ProfileForm component
        const { getByRole } =render(<ProfileForm />);
    
        // Type numeric input into the unitId and unitSize fields
        fireEvent.change(getByRole('textbox', { name: /Unit Number/i }), { target: { value: '123A' } });
        fireEvent.change(getByRole('textbox', { name: /Size/i }), { target: { value: '456B' } });
  
        // Assert that the state is updated with the numeric input
        expect(screen.getByRole('textbox', { name: /Unit Number/i })).toHaveValue('');
        expect(screen.getByRole('textbox', { name: /Size/i })).toHaveValue('');
    });

    // This test is for line(s): 112 (handleFieldsChange third if)
    test('assigns "A tenant" to occupant field when profileType is "Tenant"', () => {
        // Render the ProfileForm component
        const { getByTestId } =render(<ProfileForm />);

        // Fill out part of form
        fireEvent.change(getByTestId('type-select', { name: /type/i }), { target: { value: 'Tenant' } });
        fireEvent.change(getByTestId('occupant-select', { name: /occupant/i }), { target: { value: 'The owner' } });

        // Assert that the occupant textbox in the property field is working
        expect(screen.getByTestId('occupant-select', { name: /occupant/i })).toHaveValue('A tenant');
    });

     // This test is for line(s): 123 (addFields owner)
     test('adds a new property field with default values based on profileType (Owner)', () => {
        // Render the ProfileForm component
        const { getByTestId, getAllByRole } =render(<ProfileForm />);
    
        // Set the profileType to "Owner" (assuming it's initially set to "None")
        fireEvent.change(getByTestId('type-select', { name: /type/i }), { target: { value: 'Owner' } });
        
        // Click the button to add a new property field
        fireEvent.click(screen.getByText('Add More..'));
    
        // Assert that a new property field has been added with default values based on profileType
        expect(getAllByRole('textbox', { name: /Building Name/i })).toHaveLength(2); 
        expect(screen.getAllByDisplayValue('Myself')).toHaveLength(2);  // Assert default owner value
        expect(screen.queryByDisplayValue('A tenant')).toBeNull();  // Assert that occupant value is not present since profileType is "Owner"
    });
    
    // This test is for line(s): 124 (addFields occupant)
    test('adds a new property field with default values based on profileType (Tenant)', () => {
        // Render the ProfileForm component
        const { getByTestId, getAllByRole } =render(<ProfileForm />);
    
        // Set the profileType to "Owner" (assuming it's initially set to "None")
        fireEvent.change(getByTestId('type-select', { name: /type/i }), { target: { value: 'Tenant' } });
        
        // Click the button to add a new property field
        fireEvent.click(screen.getByText('Add More..'));
    
        // Assert that a new property field has been added with default values based on profileType
        expect(getAllByRole('textbox', { name: /Building Name/i })).toHaveLength(2); 
        expect(screen.getAllByDisplayValue('A tenant')).toHaveLength(2);  // Assert default occupant value
        expect(screen.queryByDisplayValue('Myself')).toBeNull();  // Assert that owner value is not present since profileType is "Owner"
    });

    // This test is for line(s): 135-136 (removeFields)
    test('removes a property field when there is more than one field', () => {
        // Render the ProfileForm component
        const { getAllByTestId, getAllByRole } =render(<ProfileForm />);

        // Click the button to add a new property field
        fireEvent.click(screen.getByText('Add More..'));

        // Check if there is a new textbox for each property field
        expect(getAllByRole('textbox', { name: /Building Name/i })).toHaveLength(2); 
        expect(getAllByRole('textbox', { name: /Unit Number/i })).toHaveLength(2);
        expect(getAllByRole('textbox', { name: /Owners Full Name/i })).toHaveLength(2); 
        expect(getAllByTestId('occupant-select', { name: /occupant/i })).toHaveLength(2);
        expect(getAllByRole('textbox', { name: /Size/i })).toHaveLength(2); 

        // Simulate removing the only property field by clicking the 'Remove' button
        fireEvent.click(screen.getAllByText('Remove')[0]);

        // Check if there is one less textbox for each property field
        expect(getAllByRole('textbox', { name: /Building Name/i })).toHaveLength(1); 
        expect(getAllByRole('textbox', { name: /Unit Number/i })).toHaveLength(1);
        expect(getAllByRole('textbox', { name: /Owners Full Name/i })).toHaveLength(1); 
        expect(getAllByTestId('occupant-select', { name: /occupant/i })).toHaveLength(1);
        expect(getAllByRole('textbox', { name: /Size/i })).toHaveLength(1); 
    });

    // This test is for line(s): 139 (removeFields else)
    test('does not remove the only property field', () => {
        // Render the ProfileForm component
        render(<ProfileForm />);
    
        // Simulate removing the only property field by clicking the 'Remove' button
        fireEvent.click(screen.getByText('Remove'));
    
        // Check if console.log was not called
        expect(console.log).not.toHaveBeenCalled();
    });

    // This test is for line(s): 163 (handleSubmitVerification else)
    test('displays an error message when not all necessary fields are filled out', () => {
        // Render the ProfileForm component
        const { getByRole } =render(<ProfileForm />);
    
        // Fill out only a subset of required fields (e.g., first name)
        fireEvent.change(getByRole('textbox', { name: /First Name/i }), { target: { value: 'John' } });
        
        // Submit the form
        fireEvent.click(screen.getByText('Submit'));
    
        // Check if console.log was not called
        expect(console.log).not.toHaveBeenCalled();

        // Check if alert was called properly
        expect(mockAlert).toHaveBeenCalledWith('Please fill out all necessary fields before submitting.');
    });

});