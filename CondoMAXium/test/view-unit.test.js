import React from 'react';
import { render, screen, fireEvent, waitFor, act, within, getByText } from '@testing-library/react';
import '@testing-library/jest-dom';
import ViewUnit from '../pages/view-unit/index'; // Adjust the import path based on your file structure
import supabase from "../config/supabaseClient"; // Adjust the import path based on your file structure
import { useRouter } from 'next/router';

jest.mock('../config/supabaseClient', () => ({
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockResolvedValue({
    data: [{ /* mock data relevant to the unit */ }],
    error: null
  }),
  update: jest.fn().mockResolvedValue({
    error: null
  })
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
  query: { unitid: '110' },
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
      expect(supabase.eq).toHaveBeenCalledWith('id', '110');
    });
  }, 10000);

//   test('should render and fetch unit data with correct information', async () => {
//     render(<ViewUnit />);

//     // Wait for 5 seconds
//     await new Promise(resolve => setTimeout(resolve, 5000));

//     await waitFor(() => {
//         expect(screen.getByText('Lachezara'));
//     });
//     // await waitFor(() => {
//     //   expect(supabase.from).toHaveBeenCalledWith('units');
//     //   expect(supabase.select).toHaveBeenCalledTimes(1);
//     //   expect(supabase.eq).toHaveBeenCalledWith('id', '110');
//     // });
//   }, 10000);


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

  test('changing month selection', async () => {
    const {getByRole} = render(<ViewUnit />);

    // Wait for 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));

    const comboBox = getByRole('combobox', { name: /Month/i });

    // Click to expand the combobox
    await act(async () => {
        fireEvent.mouseDown(comboBox);
    });

    const option = getByRole('option', { name: 'February' });

    await act(async () => {
      fireEvent.click(option);
    });

    expect(screen.getByText('February')).toBeInTheDocument();

    fireEvent.click(screen.getByText("Save"));
    expect(screen.getByText('Paid'));

  }, 10000);

  test('changing month selection', async () => {
    const {getByRole} = render(<ViewUnit />);

    // Wait for 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));


    fireEvent.click(screen.getByText("Save"));

  }, 10000);

  it('handles month selection and updates state', () => {
    render(<ViewUnit />);
    fireEvent.change(screen.getByLabelText('Month'), { target: { value: '3' } });
    expect(screen.getByDisplayValue('March')).toBeInTheDocument();
  });

});

