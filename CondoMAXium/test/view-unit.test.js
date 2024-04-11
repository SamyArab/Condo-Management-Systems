import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ViewUnit from '../pages/view-unit/index'; // Adjust the import path based on your file structure
import supabase from "../config/supabaseClient"; // Adjust the import path based on your file structure
import { useRouter } from 'next/router';

// Mocks
jest.mock('../config/supabaseClient', () => ({
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockResolvedValue({ data: [/* Mocked unit data */], error: null }),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock CSS module content
const mockedStyles = {};

jest.mock('../styles/units.module.css', () => ({
  ...mockedStyles,
}));

const mockPush = jest.fn();
useRouter.mockImplementation(() => ({
  query: { unitid: '107' },
  push: mockPush,
}));

describe('<ViewUnit />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render and fetch unit data', async () => {
    render(<ViewUnit />);
    // Wait for 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('units');
      expect(supabase.select).toHaveBeenCalledTimes(1);
      expect(supabase.eq).toHaveBeenCalledWith('id', '107');
    });
  }, 10000);


  test('should handle edit button click', async () => {
    render(<ViewUnit />);

    // Wait for 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));

    act(() => {
        fireEvent.click(screen.getByText(/Edit/i));
    });
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/edit-unit',
      query: { unitid: undefined },
    });
  }, 10000);

  test('should handle back button click', async () => {
    render(<ViewUnit />);

    // Wait for 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));

    act(() => {
        fireEvent.click(screen.getByText(/Back/i));
    });
    expect(mockPush).toHaveBeenCalledWith("/units");
  }, 10000);

  // Add more tests to cover different interactions and state changes
});

