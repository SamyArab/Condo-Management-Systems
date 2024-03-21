import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddPropertyForm from '../pages/add-property/index'; //path

test('renders Add Property form', () => {
    render(<AddPropertyForm />);

    // Check if the form fields are rendered
    expect(screen.getByLabelText(/Property Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Year Built/i)).toBeInTheDocument();
    // Add assertions for other form fields

    // Check if the submit button is rendered
    expect(screen.getByRole('button', { name: /Register Property/i })).toBeInTheDocument();
});

test('form submission', () => {
    render(<AddPropertyForm />);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/Property Name/i), { target: { value: 'Sample Property' } });
    fireEvent.change(screen.getByLabelText(/Year Built/i), { target: { value: '2022' } });
    fireEvent.change(screen.getByLabelText(/Unit Count/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/Province/i), { target: { value: 'Quebec' } });
    fireEvent.change(screen.getByLabelText(/Parking Count/i), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText(/Postal Code/i), { target: { value: 'J4Z 8F1' } });
    fireEvent.change(screen.getByLabelText(/Locker Count/i), { target: { value: '3' } });
    fireEvent.change(screen.getByLabelText(/Street/i), { target: { value: 'Alexander street' } });

    // Click on "register property" button
    fireEvent.click(screen.getByRole('button', { name: /Register Property/i }));

    // Check if the box with text for confirmation appears
    expect(screen.getByText(/Would you like to check the Unit as well?/i)).toBeInTheDocument();

    expect(consoleSpy).toHaveBeenCalledWith(
        'Property Info:',
        expect.objectContaining({
            propertyName: 'Sample Property',
            yearBuilt: '2022',
            unitCount: '1',
            province: 'Quebec',
            parkingCount: '2',
            postalCode: 'J4Z 8F1',
            lockerCount: '3',
            street: 'Alexander street',
        })
    );
});

test('text confirmation', async () => {
    render(<AddPropertyForm />);


    // Click on "register property" button
    fireEvent.click(screen.getByRole('button', { name: /Register Property/i }));

    // Check if the box with text for confirmation appears
    const confirmationBox = screen.getByText(/Would you like to check the Unit as well?/i);
    expect(confirmationBox).toBeInTheDocument();

    // Click on "No" button
    fireEvent.click(screen.getByRole('button', { name: /No/i }));

    // Check if the confirmation box disappears
    await waitFor(() => {
        expect(screen.queryByText(/Would you like to check the Unit as well?/i)).not.toBeInTheDocument();
    });
});