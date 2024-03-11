import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "../Reusables/Footer";
import "@testing-library/jest-dom";

test("renders Footer component", () => {
  render(<Footer />);

  // Check if the copyright text is present
  const copyrightText = screen.getByText(/© 2024 CondoMAXium/i);
  expect(copyrightText).toBeInTheDocument();
});
