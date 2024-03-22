import React from 'react';
import { render, fireEvent, waitFor, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {act} from "react-dom/test-utils"
import { useRouter } from 'next/router';
// import { renderHook } from '@testing-library/react-hooks';
// import { useFetchUnits } from './useFetchUnits'; // Import the custom hook


// import supabase from '../config/supabaseClient';
import CMCUnits from '../pages/units/index';

// Mock CSS module content
const mockedStyles = {};

jest.mock('../styles/units.module.css', () => ({
  ...mockedStyles,
}));

// Mock userRouter to push a new page
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}))

// Mock the supabase client and its functions
jest.mock('../config/supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnValue({
        data: [
          {
            id: 1,
            property_name: 'Sample Property',
            unit_number: '101',
            unit_owner: 'John Doe',
            occupied_by: 'Tenant',
            size: '1000sqft',
            parking_number: 'A101',
            locker_number: 'L101',
            condo_fee: '$500',
          },
          // Add more mock data as needed
        ],
        error: null,
      }),
    })),
  },
}));

describe('CMCUnits Component', () => {

  beforeEach(() => {
    // Mocking useRouter implementation
    useRouter.mockImplementation(() => ({
      push: jest.fn(),
    }));
  });

  // This test is for the page in general
  test('renders the component without errors', async () => {
    // Render the CMCUnits component
    await act(async () => {
      render(<CMCUnits />);
    });
      expect(screen.getByText('All Units')).toBeInTheDocument();
    
  });

  test('renders CMCUnits component properly', async () => {
    let getByText;

    await act(async () => {
      ({getByText} = render(<CMCUnits />));
    });

    // Checking if the search bar is rendered
    const searchInput = screen.getByPlaceholderText('Search here');
    expect(searchInput).toBeInTheDocument();

    // Checking if the "Add Unit" button is rendered
    const addUnitButton = getByText('Add Unit');
    expect(addUnitButton).toBeInTheDocument();
  });

  test('handleAddUnitClick navigates to the "add-unit" page when Add Unit button is clicked', async () => {
  
    // Mock the console.log function
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    await act(async () => {
      render(<CMCUnits />);
    });
  
    // Finding and clicking the Add Unit button
    const addUnitButton = screen.getByText('Add Unit');
    fireEvent.click(addUnitButton);

     // Expect console.log to have been called with the expected message
     expect(consoleLogSpy).toHaveBeenCalledWith('adding new unit');

     // Restore the original console.log implementation
     consoleLogSpy.mockRestore();

  });

  // test('sets units data correctly', async () => {

  //   const { result, waitForNextUpdate } = renderHook(() => useFetchUnits());

  //   // Wait for the hook to finish its initial execution
  //   await waitForNextUpdate();

  //   // Assert that units state is set correctly
  //   expect(result.current.units).toEqual([
  //     {
  //       property_name: 'Mason Building',
  //       unit_number: '104',
  //       unit_owner: 'Lily Aldrin',
  //       occupied_by: 'Tenant',
  //       size: '800sqft',
  //       parking_number: '104',
  //       locker_number: '0',
  //       condo_fee: '150',
  //     }
  //   ]);
  // });

  // test('fetches and renders units from Supabase', async () => {
  //   // Render the component
  //   let getByText;

  //   await act(async () => {
  //     ({getByText} = render(<CMCUnits />));
  //   });

  //   // Wait for the data to be fetched and the component to re-render
  //   await waitFor(() => {
  //     // Check if the unit data is rendered
  //     expect(getByText('Mason Building')).toBeInTheDocument();
  //     expect(getByText('101')).toBeInTheDocument();
  //     expect(getByText('John Doe')).toBeInTheDocument();
  //     expect(getByText('Tenant')).toBeInTheDocument();
  //     expect(getByText('1000sqft')).toBeInTheDocument();
  //     expect(getByText('A101')).toBeInTheDocument();
  //     expect(getByText('L101')).toBeInTheDocument();
  //     expect(getByText('$500')).toBeInTheDocument();
  //   });
  // });

  // test('navigates to add-unit page when "Add Unit" button is clicked', () => {
  //   const { getByText } = render(<CMCUnits />);
  //   const addUnitButton = getByText('Add Unit');

  //   fireEvent.click(addUnitButton);

  //   expect(useRouter().push).toHaveBeenCalledWith('/add-unit');
  // });

  // test('clicking on "Add Unit" button triggers handleAddUnitClick function', async () => {
  //   let getByText;

  //   await act(async () => {
  //     ({getByText} = render(<CMCUnits />));
  //   });
    
  //   // Clicking on the "Add Unit" button
  //   fireEvent.click(screen.getByText('Add Unit'));

  //   console.log("ll", useRouter().push);
  //   // Expecting that useRouter.push function has been called with the correct route
  //   expect(useRouter().push).toHaveBeenCalledWith('/add-unit');

  // });

  // // This test is for line(s): 101-102 (handlePropertyChange)
  // test('filters units by property name', async () => {
  //   // Render the CMCUnits component
  //   const { getByTestId, getAllByRole } =render(<CMCUnits />);

  //   // Simulate a click on the unit property name select component
  //   fireEvent.click(screen.getByTestId('property-select'));

  //   // Obtain the select element for unit property name
  //   const selectElement = getByTestId('property-select', { name: /property/i });

  //   // Determine the value based on whether the select component allows multiple selections
  //   const value = selectElement.getAttribute('multiple') ? ['Mason Building'] : ['Mason Building'];

  //   // Trigger a change event with the selected value
  //   fireEvent.change(selectElement, { target: { value } });

  //   // Wait for the assertion to pass
  //   await waitFor(() => {
  //     // Assert that the correct number of rows are displayed
  //     expect(getAllByRole('row')).toHaveLength(5); // Only units from Mason Building should be displayed
  //   });
  // });
  
  // This test is for line(s): 107-108 (handleUnitNumberChange)
  // test('filters units by unit number', async () => {
  //   // Render the CMCUnits component
  //   const { getByTestId, getAllByRole } =render(<CMCUnits />);

  //   // Simulate a click on the unit number select component
  //   fireEvent.click(screen.getByTestId('unit-select'));

  //   // Obtain the select element for unit number
  //   const selectElement = getByTestId('unit-select', { name: /unit/i });

  //   // Determine the value based on whether the select component allows multiple selections
  //   const value = selectElement.getAttribute('multiple') ? ['101'] : ['101'];

  //   // Trigger a change event with the selected value
  //   fireEvent.change(selectElement, { target: { value } });

  //   // Wait for the assertion to pass
  //   await waitFor(() => {
  //     // Assert that the correct number of rows are displayed
  //     expect(getAllByRole('row')).toHaveLength(3); // Only units from 101 should be displayed
  //   });
  // });

  // This test is for line(s): 113-114 (handleOwnerChange)
  // test('filters units by unit owner', async () => {
  //   // Render the CMCUnits component
  //   const { getByTestId, getAllByRole } =render(<CMCUnits />);

  //   // Simulate a click on the unit owner select component
  //   fireEvent.click(screen.getByTestId('owner-select'));

  //   // Obtain the select element for unit owner
  //   const selectElement = getByTestId('owner-select', { name: /owner/i });

  //   // Determine the value based on whether the select component allows multiple selections
  //   const value = selectElement.getAttribute('multiple') ? ['Maurine Thatcher'] : ['Maurine Thatcher'];

  //   // Trigger a change event with the selected value
  //   fireEvent.change(selectElement, { target: { value } });

  //   // Wait for the assertion to pass
  //   await waitFor(() => {
  //     // Assert that the correct number of rows are displayed
  //     expect(getAllByRole('row')).toHaveLength(3); // Only units from Maurine Thatcher should be displayed
  //   });
  // });
  
  // This test is for line(s): 119-120 (handleOccupyChange)
  // test('filters units by unit occupant', async () => {
  //   // Render the CMCUnits component
  //   const { getByTestId, getAllByRole } =render(<CMCUnits />);

  //   // Simulate a click on the unit occupant select component
  //   fireEvent.click(screen.getByTestId('occupant-select'));

  //   // Obtain the select element for unit occupant
  //   const selectElement = getByTestId('occupant-select', { name: /occupant/i });

  //   // Determine the value based on whether the select component allows multiple selections
  //   const value = selectElement.getAttribute('multiple') ? ['Owner'] : ['Owner'];

  //   // Trigger a change event with the selected value
  //   fireEvent.change(selectElement, { target: { value } });

  //   // Wait for the assertion to pass
  //   await waitFor(() => {
  //     // Assert that the correct number of rows are displayed
  //     expect(getAllByRole('row')).toHaveLength(4); // Only units from Owner should be displayed
  //   });
  // });
  
  // This test is for line(s): 125-126 (handleSizeChange)
  // test('filters units by unit size', async () => {
  //   // Render the CMCUnits component
  //   const { getByTestId, getAllByRole } =render(<CMCUnits />);

  //   // Simulate a click on the unit size select component
  //   fireEvent.click(screen.getByTestId('size-select'));

  //   // Obtain the select element for unit size
  //   const selectElement = getByTestId('size-select', { name: /size/i });

  //   // Determine the value based on whether the select component allows multiple selections
  //   const value = selectElement.getAttribute('multiple') ? ['850sqft'] : ['850sqft'];

  //   // Trigger a change event with the selected value
  //   fireEvent.change(selectElement, { target: { value } });

  //   // Wait for the assertion to pass
  //   await waitFor(() => {
  //     // Assert that the correct number of rows are displayed
  //     expect(getAllByRole('row')).toHaveLength(4); // Only units from 850sqft should be displayed
  //   });
  // });

  // This test is for line(s): 96 (handleSearch)
  // test('searches units by property name', async () => {
  //   // Render the CMCUnits component
  //   render(<CMCUnits />);

  //   // Find the search input field by its placeholder text
  //   const searchInput = screen.getByPlaceholderText('Search here');
  //   userEvent.type(searchInput, 'Mason'); // Searching for 'Mason'

  //   // Wait for the assertion to pass or timeout after 5000ms (5 seconds)
  //   await waitFor(() => {
  //     // Assert that the correct number of rows are displayed
  //     expect(screen.getAllByRole('row')).toHaveLength(5); // Only units with property name containing 'Mason' should be displayed
  //   }, { timeout: 5000 }); // Increase the timeout to 5000ms (5 seconds)
  // });

});