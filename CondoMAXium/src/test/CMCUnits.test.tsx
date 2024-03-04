import React from 'react';
import { render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {BrowserRouter as Router} from 'react-router-dom';
// import userEvent from "@testing-library/user-event";

import CMCUnits from '../components/CMCUnits';
// import { Checkbox, FormControlLabel } from '@mui/material';

describe("CMCUnits component", () => {

  test("renders without crashing", () => {
    render(<Router><CMCUnits /></Router>);
    expect(screen.getByText("All Units")).toBeInTheDocument();
  });

  test("handles search input correctly", () => {
    render(<Router><CMCUnits /></Router>);
    const searchInput = screen.getByPlaceholderText("Search here");
    fireEvent.change(searchInput, { target: { value: "Mason" } });
    expect(searchInput).toHaveValue("Mason");
  });

  test("filters units based on search input", () => {
    render(<Router><CMCUnits /></Router>);
    const searchInput = screen.getByPlaceholderText("Search here");
    fireEvent.change(searchInput, { target: { value: "Mason" } });

    const filteredUnitsMason = screen.getAllByText("Mason Building");
    expect(filteredUnitsMason).toHaveLength(4);  
    expect(screen.queryByText("Write Building")).toBeNull();
  });


  // TRIED TO TEST THE FILTERS, TOOK ME 2 DAYS, NOT SUCCESSFULL, I GIVE UP, IT IS WHAT IT IS


  // test('Dropdown and table update correctly', () => {
  
  //   // Render the component
  //   render( 
  //     <FormControlLabel
  //     control={<Checkbox checked={true} />}
  //     label="Mason Building"
  //   />
  //   );

  //   // fireEvent.mouseDown(selectDropdown);
  //   // Get the FormControlLabel by its label text
  //   const formControlLabel = screen.getByLabelText('Mason Building');
  //   expect(formControlLabel).toBeInTheDocument();

  //   const checkbox = screen.getByRole('checkbox', { name: 'Mason Building' });
  //   expect(checkbox).toBeChecked();

  //   // fireEvent.mouseDown(screen.getAllByText("Mason Building"));
  //   // const filteredProperties = screen.getAllByText("Jack Brown");
  //   expect(screen.getByText("Jack Brown"));
  //   expect(screen.queryByText("Ted Mosby")).toBeNull();
  //   // userEvent.selectOptions(screen.getByTestId("property-filter"), ["Mason Building"]);
  
  // });

});
