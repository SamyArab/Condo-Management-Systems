// import React from 'react';
// import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
// import CMCUnits from '../pages/units/index'; // Adjust the import path as needed
// import supabase from '../config/supabaseClient';
// import { useRouter } from 'next/router';
// import '@testing-library/jest-dom';

// // Mock CSS module content
// const mockedStyles = {};

// jest.mock('../styles/units.module.css', () => ({
//   ...mockedStyles,
// }));

// jest.mock('next/router', () => ({
//   useRouter: jest.fn(),
// }));

// describe('CMCUnits', () => {
//   const mockPush = jest.fn();

//   beforeEach(() => {
//     useRouter.mockImplementation(() => ({
//       push: mockPush,
//     }));
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   test('fetches units on component mount and displays them', async () => {
//     render(<CMCUnits />);
    
//     // Wait for the data to be fetched and displayed
//     expect(screen.getByText('All Units')).toBeInTheDocument();
//   });

//   test("handles search input correctly", async () => {
//     render(<CMCUnits />);
//     const searchInput = screen.getByPlaceholderText("Search here");
//     act(() => {
//       fireEvent.change(searchInput, { target: { value: "101" } });
//     });
//     // Wait for 5 seconds
//     await new Promise(resolve => setTimeout(resolve, 5000)); 

//     expect(searchInput).toHaveValue("101");
//     expect(screen.getByText('101')).toBeInTheDocument();
//     expect(screen.queryByText('102')).toBeNull();
//   }, 10000);

//   test('navigates to edit page on edit button click', async () => {
//     render(<CMCUnits />);

//     // Wait for 5 seconds
//     await new Promise(resolve => setTimeout(resolve, 5000));

//     // Wait for the units to be fetched and the "Edit" button to be rendered
//     expect(screen.getByText('101')).toBeInTheDocument();

//     // Now that we know the units are rendered, find and click the "Edit" button
//     const editButtons = screen.getAllByText('Edit');
//     expect(editButtons).toHaveLength(2); // or the expected number of units
    
//     act(() => {
//       const editButton = screen.getAllByText('Edit')[0];
//       fireEvent.click(editButton);
//     });

//     expect(mockPush).toHaveBeenCalledWith({ pathname: '/edit-unit', query: { unitid: 108 } });
//   }, 10000); // 10 seconds

//   test('navigates to view page on view button click', async () => {
//     render(<CMCUnits />);

//     // Wait for 5 seconds
//     await new Promise(resolve => setTimeout(resolve, 5000));

//     // Now that we know the units are rendered, find and click the "Edit" button
//     const viewButtons = screen.getAllByText('View');
//     expect(viewButtons).toHaveLength(2); // or the expected number of units
    
//     act(() => {
//       const viewButton = screen.getAllByText('View')[0];
//       fireEvent.click(viewButton);
//     });

//     expect(mockPush).toHaveBeenCalledWith({ pathname: '/view-unit', query: { unitid: 108 } });
//   }, 10000); // 10 seconds

//   test('navigates to add unit page on add button click', async () => {
//       render(<CMCUnits />);
      
//       act(() => {
//         const addButton = screen.getByText('Add Unit');
//         fireEvent.click(addButton);
//       });
  
//       expect(mockPush).toHaveBeenCalledWith('/add-unit');
//   });

//   test('verify condo fee status', async () => {
//     render(<CMCUnits />);
    
//     // Wait for 5 seconds
//     await new Promise(resolve => setTimeout(resolve, 5000));

//     expect(screen.getByText('Paid')).toBeInTheDocument();
//   }, 10000);

  
// });
