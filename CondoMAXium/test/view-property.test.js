import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from "next/router";
import supabase from "../config/supabaseClient";
import ViewProperty from '../pages/view-property/index';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock CSS module content
const mockedStyles = {};

jest.mock('../styles/units.module.css', () => ({
  ...mockedStyles,
}));

jest.mock('../config/supabaseClient', () => ({
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockResolvedValue({
    data: [{
      buildingName: 'Test Building',
      unitsCount: '10',
      parkingCount: '20',
      lockerCount: '5',
      yearBuilt: '1999',
      province: 'ON',
      postalCode: '12345',
      street: '123 Test St',
    }],
    error: null
  })
}));

describe('ViewProperty Component', () => {
  const mockedRouter = {
    push: jest.fn(),
    query: { propertyid: '123' }
  };

  const mockedUnitsData = [
    { condo_fee_total: 300, _fee__jan: 300, _fee__feb: 300, _fee__mar: 300, _fee__apr: 300, _fee__may: 300, _fee__jun: 300, _fee__jul: 300, _fee__aug: 300, _fee__sep: 300, _fee__oct: 300, _fee__nov: 300, _fee__dec: 300 },
    { condo_fee_total: 200, _fee__jan: 200, _fee__feb: 200, _fee__mar: 200, _fee__apr: 200, _fee__may: 200, _fee__jun: 200, _fee__jul: 200, _fee__aug: 200, _fee__sep: 200, _fee__oct: 200, _fee__nov: 200, _fee__dec: 200 }
  ];

  beforeEach(() => {
    // Mock the useRouter hook to return the mockedRouter object
    useRouter.mockImplementation(() => mockedRouter);

    // Set up supabase mock to simulate fetching data from the database
    supabase.from.mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValueOnce({ data: mockedUnitsData, error: null })
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    const { container } = render(<ViewProperty />);
    expect(container).toBeInTheDocument();
  });

//   test('fetches property data on mount if propertyid is provided', async () => {
//     render(<ViewProperty />);
//     await waitFor(() => expect(supabase.from).toHaveBeenCalledWith('properties'));
//     await waitFor(() => expect(supabase.select).toHaveBeenCalled());
//     expect(screen.getByText('12345')).toBeInTheDocument();
//   });

  test('handles errors during data fetching', async () => {
    supabase.eq.mockResolvedValueOnce({ data: null, error: { message: 'Error fetching data' } });
    console.error = jest.fn();
    render(<ViewProperty />);
    await waitFor(() => expect(console.error).toHaveBeenCalledWith('Error fetching unit', 'Error fetching data'));
  });

  test('navigates to edit page on edit click', () => {
    render(<ViewProperty />);
    fireEvent.click(screen.getByText('View Units in Property'));
    expect(mockedRouter.push).toHaveBeenCalledWith('/units');
  });

  test('calculates and displays financial information correctly', async () => {
    render(<ViewProperty />);
    await waitFor(() => expect(screen.getByText('Total Yearly Condo Fees:')).toBeInTheDocument());
  });

  test('displays total monthly fees correctly', async () => {
    render(<ViewProperty />);
    await waitFor(() => {
      const totalFeesCells = screen.getAllByText('600');
      expect(totalFeesCells.length).toBe(12); // 12 months, each should have $600 as total fees
    });
  });

  // Add more tests as needed
});
