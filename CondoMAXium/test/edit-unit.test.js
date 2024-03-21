import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import EditUnit from '../pages/edit-unit/index';
import { act } from 'react-dom/test-utils';

// Mock CSS module content
const mockedStyles = {};

jest.mock('../styles/units.module.css', () => ({
  ...mockedStyles,
}));

// Mocking useRouter hook
jest.mock('next/router', () => ({
    useRouter: () => ({
      query: { unitid: 'mockUnitId' }, // Mocking unitid from router query
      push: jest.fn(),
    }),
  }));

// // Mocking supabase client
// jest.mock('../config/supabaseClient', () => ({
//   __esModule: true,
//   default: {
//     from: () => ({
//       insert: jest.fn(() => Promise.resolve({ data: {}, error: null })),
//     }),
//     auth: {
//       getUser: jest.fn(() => ({
//         data: { user: { id: 1 } },
//       })),
//     },
//   },
// }));

// Mocking supabase client
jest.mock('../config/supabaseClient', () => ({
    __esModule: true,
    default: {
      from: () => ({
        update: jest.fn(() => Promise.resolve({ error: null })),
        select: () => ({
          eq: () => Promise.resolve({ data: [{ // Mocking fetched unit data
            property_name: 'Mock Property',
            unit_number: '101',
            unit_owner: 'Mock Owner',
            occupied_by: 'Owner',
            tenantFullName: '',
            size: '1000 sqft',
            parking_number: 'P101',
            plocker_number: 'L101',
            condo_fee: '100',
          }], error: null }),
        }),
      }),
    },
  }));

describe('EditUnitForm component', () => {

    // beforeEach(() => {
    //     // Mocking useRouter implementation
    //     useRouter.mockImplementation(() => ({
    //         push: jest.fn(),
    //     }));
    // });
    
    test('Form submission with valid data', async () => {
        let getByLabelText, getByText, getByRole;

        await act(async () => {
            ({getByLabelText, getByText, getByRole} = render(<EditUnit />));
        });
        // fireEvent.change(getByRole('textbox', { name: /Property Name/i }), { target: { value: 'Test Property' } });
        // fireEvent.change(getByRole('textbox', { name: /Unit Number/i }), { target: { value: '101' } });
        // fireEvent.change(getByRole('textbox', { name: /Owners Full Name/i }), { target: { value: 'John Doe' } });
        // fireEvent.change(getByRole('textbox', { name: /Unit Size/i }), { target: { value: '1000 sqft' } });
        // fireEvent.change(getByRole('textbox', { name: /Assigned Parking Number/i }), { target: { value: 'P101' } });
        // fireEvent.change(getByRole('textbox', { name: /Assigned Locker Number/i }), { target: { value: 'L101' } });
        // fireEvent.change(getByRole('textbox', { name: /Condo Fee/i }), { target: { value: '100' } });

        // Check if initial data is rendered correctly
        expect(getByRole('textbox', { name: /Property Name/i })).toContain('Mock Property');
        expect(getByLabelText('Unit Number')).toHaveValue('101');
        expect(getByLabelText('Owners Full Name')).toHaveValue('Mock Owner');
        expect(getByLabelText('Unit Size')).toHaveValue('1000 sqft');
        expect(getByLabelText('Assigned Parking Number')).toHaveValue('P101');
        expect(getByLabelText('Assigned Locker Number')).toHaveValue('L101');
        expect(getByLabelText('Condo Fee')).toHaveValue('100');

        fireEvent.click(getByText('Save'));

        await waitFor(() => {
        expect(document.querySelector('.outsideContainer')).toBeNull(); // Assuming successful submission hides the form
        });
    }, 10000); // Increase the timeout to 10000ms (10 seconds)

  
});
