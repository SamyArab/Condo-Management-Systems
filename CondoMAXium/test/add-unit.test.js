import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import AddUnit from '../pages/add-unit/index';

// Mock CSS module content
const mockedStyles = {};

jest.mock('../styles/units.module.css', () => ({
  ...mockedStyles,
}));

// Mock userRouter to push a new page
jest.mock('next/router', () => ({
    useRouter: jest.fn()
}))

// Mocking supabase client
jest.mock('../config/supabaseClient', () => ({
  __esModule: true,
  default: {
    from: () => ({
      insert: jest.fn(() => Promise.resolve({ data: {}, error: null })),
    }),
    auth: {
      getUser: jest.fn(() => ({
        data: { user: { id: 1 } },
      })),
    },
  },
}));

describe('AddUnitForm component', () => {

    beforeEach(() => {
        // Mocking useRouter implementation
        useRouter.mockImplementation(() => ({
            push: jest.fn(),
        }));
    });
    
  test('Form submission with valid data', async () => {
    const { getByLabelText, getByText, getByRole } = render(<AddUnit />);

    fireEvent.change(getByRole('textbox', { name: /Property Name/i }), { target: { value: 'Test Property' } });
    fireEvent.change(getByRole('textbox', { name: /Unit Number/i }), { target: { value: '101' } });
    fireEvent.change(getByRole('textbox', { name: /Owners Full Name/i }), { target: { value: 'John Doe' } });
    fireEvent.change(getByRole('textbox', { name: /Unit Size/i }), { target: { value: '1000 sqft' } });
    fireEvent.change(getByRole('textbox', { name: /Assigned Parking Number/i }), { target: { value: 'P101' } });
    fireEvent.change(getByRole('textbox', { name: /Assigned Locker Number/i }), { target: { value: 'L101' } });
    fireEvent.change(getByRole('textbox', { name: /Condo Fee/i }), { target: { value: '100' } });

    fireEvent.click(getByText('Save'));

    await waitFor(() => {
      expect(document.querySelector('.outsideContainer')).toBeNull(); // Assuming successful submission hides the form
    });
}, 10000); // Increase the timeout to 10000ms (10 seconds)

  
});
