// import React from 'react';
// import { render, screen, fireEvent, waitFor, act, waitForElementToBeRemoved } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import { useRouter } from "next/router";
// import EditUnitPage from '../pages/edit-unit/index';
// import supabase from "../config/supabaseClient";

// // Mock CSS module content
// const mockedStyles = {};

// jest.mock('../styles/units.module.css', () => ({
//   ...mockedStyles,
// }));

// jest.mock('next/router', () => ({
//   useRouter: jest.fn(),
// }));

// // // Mock preventDefault to verify it's called
// // const mockPreventDefault = jest.fn();

// jest.mock('../config/supabaseClient', () => ({
//   from: jest.fn().mockReturnThis(),
//   select: jest.fn().mockReturnThis(),
//   eq: jest.fn().mockResolvedValue({
//     data: [{ 
//       property_name: 'Mock Property',
//       unit_number: '101',
//       first_name_owner: 'John', 
//       last_name_owner: 'Doe',
//       emailUnit: 'johndoe@example.com',
//       owner_phone: '1234567890',
//       first_name_tenant: '',
//       last_name_tenant: 'Smith',
//       tenant_email: 'janesmith@example.com',
//       tenant_phone: '0987654321',
//       occupied_by: 'Tenant',
//       size: '500',
//       condo_fee_sqft: '2.5',
//       parking_fee: '30',
//       parking_number: '102',
//       locker_number: '103', 
//     }],
//     error: null,
//   }),
//   update: jest.fn().mockResolvedValue({
//     data: {},
//     error: null,
//   }),
// }));

// describe('EditUnitPage', () => {
//   const mockPush = jest.fn();

//   beforeEach(() => {
//     useRouter.mockImplementation(() => ({
//       query: { unitid: '1' },
//       push: mockPush,
//     }));
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   test('renders correctly', async () => {
//     render(<EditUnitPage />);
//       // Wait for the input to have the value "John" before proceeding with the assertions.
//       // This implicitly waits for all associated state updates to complete.
//       const input = await screen.findByDisplayValue('John');

//       // Now that the component has finished loading and updating, you can make your assertions.
//       expect(screen.getByText('Edit Unit')).toBeInTheDocument();
//       expect(input).toBeInTheDocument();
//       expect(input).toHaveAttribute('name', 'first_name_owner');

//   });

//   test('shows and hides the incomplete form dialog', async () => {
//     render(<EditUnitPage />);
//     // Replace this comment with the code to trigger the incomplete form state.
//     act(() => {
//       fireEvent.click(screen.getByText('Save'));
//     });

//     // Check if the dialog appears
//     expect(screen.getByText('Incomplete Form')).toBeInTheDocument();
//     expect(screen.getByText('Please fill out all required fields before saving.')).toBeInTheDocument();

//     // Simulate clicking the 'Okay' button to close the dialog
//     act(() => {
//       fireEvent.click(screen.getByText('Okay'));
//     });

//     // Check if the dialog has closed
//     expect(screen.queryByText('Incomplete Form')).not.toBeInTheDocument();
//   });



//   test('validates tenant information when unit is occupied by a tenant', async () => {
//     render(<EditUnitPage />);
//     const input1 = await screen.findByDisplayValue('Tenant');
//     const input2 = await screen.findByDisplayValue('');
//     const input3 = await screen.findByDisplayValue('2.5');
//     const input4 = await screen.findByDisplayValue('1234567890');
//     const input5 = await screen.findByDisplayValue('500');
//     console.error = jest.fn();

//     act(() => {
//       expect(input1).toBeInTheDocument();
//       expect(input1).toHaveAttribute('name', 'occupied_by');

//       // Attempt to submit the form
//       fireEvent.click(screen.getByText('Save'));
//   });

//     // Check if an error is shown for the tenant fields
//     // This depends on how you show validation errors; adjust the assertion accordingly
//     expect(screen.getByText('Please fill out all required fields before saving.')).toBeInTheDocument();

//     act(() => {
//       expect(input2).toBeInTheDocument();
//       expect(input2).toHaveAttribute('name', 'first_name_tenant');
//       expect(input3).toBeInTheDocument();
//       expect(input3).toHaveAttribute('name', 'condo_fee_sqft');
//       expect(input4).toBeInTheDocument();
//       expect(input4).toHaveAttribute('name', 'owner_phone');
//       expect(input5).toBeInTheDocument();
//       expect(input5).toHaveAttribute('name', 'size');

//       // Now fill in the tenant fields with valid data
//       fireEvent.change(input2, { target: { value: 'Jane' } });
//       fireEvent.change(input3, { target: { value: '6.0.5' } });
//       fireEvent.change(input4, { target: { value: '1234512345' } });
//       fireEvent.change(input5, { target: { value: '300' } });
//       // Repeat for last name, email, and phone with valid data

//       // Submit the form again
//       fireEvent.click(screen.getByText('Save'));
//     });

//     expect(console.error).toHaveBeenCalledWith('Error updating unit:', '_supabaseClient.default.from(...).update(...).eq is not a function');
//   });

//   test('navigates to "/units" after a successful update', async () => {
//     // Mock the update operation to be successful
//     supabase.from().select().eq.mockResolvedValueOnce({ data: { id: 108 }, error: null });

//     render(<EditUnitPage />);
//     // Trigger the update here, possibly by simulating form submission
//     // For example, if clicking a 'Save' button triggers the update:
//     act(() => {
//       fireEvent.click(screen.getByText('Save'));
//     });
//   });

//   test('validates tenant information when unit is occupied by a tenant', async () => {
//     render(<EditUnitPage />);
//     const input1 = await screen.findByDisplayValue('Tenant');

//     console.error = jest.fn();

//     act(() => {
//       expect(input1).toBeInTheDocument();
//       expect(input1).toHaveAttribute('name', 'occupied_by');

//       fireEvent.change(input1, { target: { value: 'Owner' } });

//       // Attempt to submit the form
//       fireEvent.click(screen.getByText('Save'));
//   });

//     expect(console.error).toHaveBeenCalledWith('Error updating unit:', '_supabaseClient.default.from(...).update(...).eq is not a function');
//   });

//   // test('validates that all inputs can be changed', async () => {
//   //   // Local mock inside the test
//   //   jest.spyOn(supabase.from('units'), 'select').mockResolvedValueOnce({
//   //     data: [{
//   //       property_name: 'Mock Property',
//   //       unit_number: '',
//   //       first_name_owner: '',
//   //       last_name_owner: '',
//   //       emailUnit: '',
//   //       owner_phone: '',
//   //       first_name_tenant: '',
//   //       last_name_tenant: '',
//   //       tenant_email: '',
//   //       tenant_phone: '',
//   //       occupied_by: '',
//   //       size: '',
//   //       condo_fee_sqft: '',
//   //       parking_fee: '',
//   //       parking_number: '',
//   //       locker_number: '',
//   //     }],
//   //     error: null,
//   //   });

//   //   render(<EditUnitPage />);
//   //   const input1 = await screen.findByRole('textbox', { name: /Property Name/i });
//   //   const input2 = await screen.findByRole('textbox', { name: /Owners First Name/i });

//   //   expect(input1.value).toBe('Mock Property');
    
//     // const input2 = await screen.findByDisplayValue('101');
//     // const input3 = await screen.findByDisplayValue('John');
//     // const input4 = await screen.findByDisplayValue('Doe');
//     // const input5 = await screen.findByDisplayValue('johndoe@example.com');
//     // const input6 = await screen.findByDisplayValue('1234567890');
//     // const input7 = await screen.findByDisplayValue('');
//     // const input8 = await screen.findByDisplayValue('Smith');
//     // const input9 = await screen.findByDisplayValue('janesmith@example.com');
//     // const input10 = await screen.findByDisplayValue('0987654321');
//     // const input11 = await screen.findByDisplayValue('Tenant');
//     // const input12 = await screen.findByDisplayValue('500');
//     // const input13 = await screen.findByDisplayValue('2.5');
//     // const input14 = await screen.findByDisplayValue('30');
//     // const input15 = await screen.findByDisplayValue('102');
//     // const input16 = await screen.findByDisplayValue('103');
//     // console.error = jest.fn();

//     // act(() => {
//       // expect(input1).toBeInTheDocument();
//       // expect(input1).toHaveAttribute('name', 'property_name');
//       // expect(input2).toBeInTheDocument();
//       // expect(input2).toHaveAttribute('name', 'unit_number');
//       // expect(input3).toBeInTheDocument();
//       // expect(input3).toHaveAttribute('name', 'first_name_owner');
//       // expect(input4).toBeInTheDocument();
//       // expect(input4).toHaveAttribute('name', 'last_name_owner');
//       // expect(input5).toBeInTheDocument();
//       // expect(input5).toHaveAttribute('name', 'emailUnit');
//       // expect(input6).toBeInTheDocument();
//       // expect(input6).toHaveAttribute('name', 'owner_phone');
//       // expect(input7).toBeInTheDocument();
//       // expect(input7).toHaveAttribute('name', 'first_name_tenant');
//       // expect(input8).toBeInTheDocument();
//       // expect(input8).toHaveAttribute('name', 'last_name_tenant');
//       // expect(input9).toBeInTheDocument();
//       // expect(input9).toHaveAttribute('name', 'tenant_email');
//       // expect(input10).toBeInTheDocument();
//       // expect(input10).toHaveAttribute('name', 'tenant_phone');
//       // expect(input11).toBeInTheDocument();
//       // expect(input11).toHaveAttribute('name', 'occupied_by');
//       // expect(input12).toBeInTheDocument();
//       // expect(input12).toHaveAttribute('name', 'size');
//       // expect(input13).toBeInTheDocument();
//       // expect(input13).toHaveAttribute('name', 'condo_fee_sqft');
//       // expect(input14).toBeInTheDocument();
//       // expect(input14).toHaveAttribute('name', 'parking_fee');
//       // expect(input15).toBeInTheDocument();
//       // expect(input15).toHaveAttribute('name', 'parking_number');
//       // expect(input16).toBeInTheDocument();
//       // expect(input16).toHaveAttribute('name', 'locker_number');

//       // Now fill in the tenant fields with valid data
//       // fireEvent.change(input1, { target: { value: 'Mock Building' } });
//       // fireEvent.change(input2, { target: { value: 'Jane' } });
//       // fireEvent.change(input2, { target: { value: '102' } });
//       // fireEvent.change(input3, { target: { value: 'Jane' } });
//       // fireEvent.change(input4, { target: { value: 'Smith' } });
//       // fireEvent.change(input5, { target: { value: 'janesmith@example.com' } });
//       // fireEvent.change(input6, { target: { value: '4444444444' } });
//       // fireEvent.change(input7, { target: { value: 'John' } });
//       // fireEvent.change(input8, { target: { value: 'Doe' } });
//       // fireEvent.change(input9, { target: { value: 'johndoe@example.com' } });
//       // fireEvent.change(input10, { target: { value: '8888888888' } });
//       // fireEvent.change(input11, { target: { value: 'Tenant' } });
//       // fireEvent.change(input12, { target: { value: '600' } });
//       // fireEvent.change(input13, { target: { value: '2' } });
//       // fireEvent.change(input14, { target: { value: '40' } });
//       // fireEvent.change(input15, { target: { value: '103' } });
//       // fireEvent.change(input16, { target: { value: '104' } });
    

//       // Submit the form again
//       // fireEvent.click(screen.getByText('Save'));
//     // });

//     // expect(console.error).toHaveBeenCalledWith('Error updating unit:', '_supabaseClient.default.from(...).update(...).eq is not a function');
  
//   //   await waitFor(() => {
//   //     expect(input1.value).toBe('Mock Building');
//   //     expect(input2.value).toBe('Jane');
//   //     // Continue for each input...
//   //   });

//   //   // Restore the original implementation after the test
//   //   jest.restoreAllMocks();
  
  
//   // });

// });

