import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import CMCUnits from '../pages/units/index';

// Mock CSS module content
const mockedStyles = {};

jest.mock('../styles/units.module.css', () => ({
  ...mockedStyles,
}));

describe('CMCUnits Component', () => {

  // This test is for the page in general
  test('renders the component without errors', () => {
    // Render the CMCUnits component
    render(<CMCUnits />);
    expect(screen.getByText('All Units')).toBeInTheDocument();
  });

  // This test is for line(s): 101-102 (handlePropertyChange)
  test('filters units by property name', async () => {
    // Render the CMCUnits component
    const { getByTestId, getAllByRole } =render(<CMCUnits />);

    // Simulate a click on the unit property name select component
    fireEvent.click(screen.getByTestId('property-select'));

    // Obtain the select element for unit property name
    const selectElement = getByTestId('property-select', { name: /property/i });

    // Determine the value based on whether the select component allows multiple selections
    const value = selectElement.getAttribute('multiple') ? ['Mason Building'] : ['Mason Building'];

    // Trigger a change event with the selected value
    fireEvent.change(selectElement, { target: { value } });

    // Wait for the assertion to pass
    await waitFor(() => {
      // Assert that the correct number of rows are displayed
      expect(getAllByRole('row')).toHaveLength(5); // Only units from Mason Building should be displayed
    });
  });
  
  // This test is for line(s): 107-108 (handleUnitNumberChange)
  test('filters units by unit number', async () => {
    // Render the CMCUnits component
    const { getByTestId, getAllByRole } =render(<CMCUnits />);

    // Simulate a click on the unit number select component
    fireEvent.click(screen.getByTestId('unit-select'));

    // Obtain the select element for unit number
    const selectElement = getByTestId('unit-select', { name: /unit/i });

    // Determine the value based on whether the select component allows multiple selections
    const value = selectElement.getAttribute('multiple') ? ['101'] : ['101'];

    // Trigger a change event with the selected value
    fireEvent.change(selectElement, { target: { value } });

    // Wait for the assertion to pass
    await waitFor(() => {
      // Assert that the correct number of rows are displayed
      expect(getAllByRole('row')).toHaveLength(3); // Only units from 101 should be displayed
    });
  });

  // This test is for line(s): 113-114 (handleOwnerChange)
  test('filters units by unit owner', async () => {
    // Render the CMCUnits component
    const { getByTestId, getAllByRole } =render(<CMCUnits />);

    // Simulate a click on the unit owner select component
    fireEvent.click(screen.getByTestId('owner-select'));

    // Obtain the select element for unit owner
    const selectElement = getByTestId('owner-select', { name: /owner/i });

    // Determine the value based on whether the select component allows multiple selections
    const value = selectElement.getAttribute('multiple') ? ['Maurine Thatcher'] : ['Maurine Thatcher'];

    // Trigger a change event with the selected value
    fireEvent.change(selectElement, { target: { value } });

    // Wait for the assertion to pass
    await waitFor(() => {
      // Assert that the correct number of rows are displayed
      expect(getAllByRole('row')).toHaveLength(3); // Only units from Maurine Thatcher should be displayed
    });
  });
  
  // This test is for line(s): 119-120 (handleOccupyChange)
  test('filters units by unit occupant', async () => {
    // Render the CMCUnits component
    const { getByTestId, getAllByRole } =render(<CMCUnits />);

    // Simulate a click on the unit occupant select component
    fireEvent.click(screen.getByTestId('occupant-select'));

    // Obtain the select element for unit occupant
    const selectElement = getByTestId('occupant-select', { name: /occupant/i });

    // Determine the value based on whether the select component allows multiple selections
    const value = selectElement.getAttribute('multiple') ? ['Owner'] : ['Owner'];

    // Trigger a change event with the selected value
    fireEvent.change(selectElement, { target: { value } });

    // Wait for the assertion to pass
    await waitFor(() => {
      // Assert that the correct number of rows are displayed
      expect(getAllByRole('row')).toHaveLength(4); // Only units from Owner should be displayed
    });

  });
  
  // This test is for line(s): 125-126 (handleSizeChange)
  test('filters units by unit size', async () => {
    // Render the CMCUnits component
    const { getByTestId, getAllByRole } =render(<CMCUnits />);

    // Simulate a click on the unit size select component
    fireEvent.click(screen.getByTestId('size-select'));

    // Obtain the select element for unit size
    const selectElement = getByTestId('size-select', { name: /size/i });

    // Determine the value based on whether the select component allows multiple selections
    const value = selectElement.getAttribute('multiple') ? ['850sqft'] : ['850sqft'];

    // Trigger a change event with the selected value
    fireEvent.change(selectElement, { target: { value } });

    // Wait for the assertion to pass
    await waitFor(() => {
      // Assert that the correct number of rows are displayed
      expect(getAllByRole('row')).toHaveLength(4); // Only units from 850sqft should be displayed
    });
  });

  // This test is for line(s): 96 (handleSearch)
  test('searches units by property name', async () => {
    // Render the CMCUnits component
    render(<CMCUnits />);

    // Find the search input field by its placeholder text
    const searchInput = screen.getByPlaceholderText('Search here');
    userEvent.type(searchInput, 'Mason'); // Searching for 'Mason'

    // Wait for the assertion to pass or timeout after 5000ms (5 seconds)
    await waitFor(() => {
      // Assert that the correct number of rows are displayed
      expect(screen.getAllByRole('row')).toHaveLength(5); // Only units with property name containing 'Mason' should be displayed
    }, { timeout: 5000 }); // Increase the timeout to 5000ms (5 seconds)
  });

});