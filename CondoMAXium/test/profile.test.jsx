import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProfilePage from "../components/profile";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";

// Mock console.log for testing purposes
console.log = jest.fn();

test("renders correctly", () => {
  render(
    <Router>
      <ProfilePage />
    </Router>
  );

  // Check if the user's name is rendered
  const userName = screen.getByText(/John Doe/i);
  expect(userName).toBeInTheDocument();

  // Check if the "Properties" title is rendered
  const propertiesTitle = screen.getByText(/Properties/i);
  expect(propertiesTitle).toBeInTheDocument();

  // Check if the "Keys" title is rendered
  const keysLabel = screen.getByLabelText(/Enter Keys/);
  expect(keysLabel).toBeInTheDocument();

  // Check if the "Payments" title is rendered
  const paymentsTitle = screen.getByText(/Payments/i);
  expect(paymentsTitle).toBeInTheDocument();

  // Check if the "Logout" button is rendered
  const logoutButton = screen.getByRole("button", { name: /Logout/i });
  expect(logoutButton).toBeInTheDocument();
});

test("handles logout", () => {
  render(
    <Router>
      <ProfilePage />
    </Router>
  );

  // Click the "Logout" button
  const logoutButton = screen.getByRole("button", { name: /Logout/i });
  fireEvent.click(logoutButton);

  // Check if console.log is called with the correct message
  expect(console.log).toHaveBeenCalledWith("Logging out...");
});

test("handles payment", () => {
  render(
    <Router>
      <ProfilePage />
    </Router>
  );

  // Click the "Pay" button
  const payButton = screen.getByRole("button", { name: /Pay/i });
  fireEvent.click(payButton);

  // Check if console.log is called with the correct message
  expect(console.log).toHaveBeenCalledWith(
    "Processing payment for payment index 0..."
  );
});
