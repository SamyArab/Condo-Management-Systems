import React from "react";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddAmenityForm from '../pages/add-amenity/index';  // Adjust the import path as necessary


const mockPush = jest.fn(); 

jest.mock('next/router', () => ({
    useRouter: () => ({
      push:mockPush
    })
}));

jest.mock('../styles/units.module.css', () => {
    return {
      __esModule: true,
      default: {},
    };
  });

describe('AddAmenityForm', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.mock('next/router', () => ({
      useRouter() {
        return {
          push: mockPush,
        };
      },
    }));
    render(<AddAmenityForm />);
  });

  test('renders the form correctly', () => {
    expect(screen.getByText(/Add Amenity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Floor Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Square Footage/i)).toBeInTheDocument();
  });

  test('updates input fields correctly', async () => {
    const amenityNameInput = screen.getByLabelText(/Name/i);
    const floorInput = screen.getByLabelText(/Floor Number/i);
    const sqftInput = screen.getByLabelText(/Square Footage/i);
    const descriptionInput = screen.getByLabelText(/Description/i);

    await userEvent.type(amenityNameInput, 'Gym');
    await userEvent.type(floorInput, '5');
    await userEvent.type(sqftInput, '1200');
    await userEvent.type(descriptionInput, 'Full gym with weights and machines');

    expect(amenityNameInput.value).toBe('Gym');
    expect(floorInput.value).toBe('5');
    expect(sqftInput.value).toBe('1200');
    expect(descriptionInput.value).toBe('Full gym with weights and machines');
  });

  test('handles checkbox changes', async () => {
    const mondayCheckbox = screen.getByLabelText(/Monday/i);
    fireEvent.click(mondayCheckbox);
    expect(mondayCheckbox.checked).toBeTruthy();
  });

  test('submits the form and navigates', async () => {
    const submitButton = screen.getByText(/Submit/i);

    await fireEvent.click(submitButton);

    // Since the submission is asynchronous, we may need to wait for any promises to resolve
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/profile');
    });
  });

  // You can also add a test to simulate selecting times from dropdowns, error handling, etc.
});
