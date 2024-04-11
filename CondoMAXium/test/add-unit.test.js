// import React from 'react';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import AddUnitForm from '../pages/add-unit/index'; // Adjust the import path as needed
// import supabase from '../config/supabaseClient';
// import userEvent from '@testing-library/user-event';

// jest.mock('../config/supabaseClient');

// // Mock CSS module content
// const mockedStyles = {};

// jest.mock('../styles/units.module.css', () => ({
//   ...mockedStyles,
// }));

// jest.mock('next/router', () => ({
//     useRouter: jest.fn(),
//   }));

// describe('AddUnitForm', () => {
//     beforeEach(() => {
//       supabase.from.mockReturnValue({
//         select: jest.fn().mockReturnValue({
//           eq: jest.fn().mockResolvedValue({ data: [{ propertyId: 5 }], error: null })
//         })
//       });
//     });
  
//     afterEach(() => {
//       jest.clearAllMocks();
//     });
  
//     test('updates state on input change', () => {
//       render(<AddUnitForm />);
//       expect(screen.getByText('Add Unit'));
//     //   const ownerFirstNameInput = screen.getByLabelText(/Owners First Name/i);
//     //   userEvent.type(ownerFirstNameInput, 'John');
//     //   expect(ownerFirstNameInput.value).toBe('John');
//     });
  
//     test('displays tenant fields when Occupied By is set to Tenant', () => {
//       render(<AddUnitForm />);
//     //   const occupiedBySelect = screen.getByLabelText(/Occupied By/i);
//     //   fireEvent.change(occupiedBySelect, { target: { value: 'Tenant' } });
//     //   expect(screen.getByLabelText(/Tenants First Name/i)).toBeInTheDocument();
//     });
  
//     test('shows an error dialog when attempting to save an incomplete form', () => {
//       render(<AddUnitForm />);
//     //   const saveButton = screen.getByText(/Save/i);
//     //   userEvent.click(saveButton);
//     //   expect(screen.getByText(/Incomplete Form/i)).toBeInTheDocument();
//     });
  
//     test('fetches property ID based on propertyName', async () => {
//       render(<AddUnitForm />);
//     //   const propertyNameInput = screen.getByLabelText(/Property Name/i);
//     //   userEvent.type(propertyNameInput, 'Test Building'); 
      
//     //   await waitFor(() => {
//     //     expect(supabase.from).toHaveBeenCalledWith('properties');
//     //     expect(supabase.from().select).toHaveBeenCalledWith('*');
//     //     expect(supabase.from().select().eq).toHaveBeenCalledWith('buildingName', 'Test Building');
//     //   });
//     });
  
//     // Add more tests as needed...
//   });