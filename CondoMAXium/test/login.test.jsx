import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SignInSide from "../components/login";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";

test("renders sign in form", () => {
  render(
    <Router>
      <SignInSide />{" "}
    </Router>
  );

  // Check if the "Sign in" text is present
  const signInText = screen.getByText(/Sign in/);
  expect(signInText).toBeInTheDocument();

  // Check if the "Email Address" label is present
  const emailLabel = screen.getByLabelText(/email address/i);
  expect(emailLabel).toBeInTheDocument();

  // Check if the "Password" label is present
  const passwordLabel = screen.getByLabelText(/password/i);
  expect(passwordLabel).toBeInTheDocument();

  // Check if the "Remember me" checkbox is present
  const rememberMeCheckbox = screen.getByLabelText(/remember me/i);
  expect(rememberMeCheckbox).toBeInTheDocument();

  // Check if the "Sign In" button is present
  const signInButton = screen.getByRole("button", { name: /Sign In/ });
  expect(signInButton).toBeInTheDocument();

  // Check if the "Forgot password?" link is present
  const forgotPasswordLink = screen.getByText(/forgot password/i);
  expect(forgotPasswordLink).toBeInTheDocument();

  // Check if the "Don't have an account? Sign Up" link is present
  const signUpLink = screen.getByText(/don't have an account/i);
  expect(signUpLink).toBeInTheDocument();
});

test("form submission", () => {
  render(
    <Router>
      <SignInSide />
    </Router>
  );

  // Mock the console.log function
  console.log = jest.fn();

  // Fill in the form inputs
  fireEvent.change(screen.getByLabelText(/email address/i), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "password123" },
  });

  // Submit the form
  fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

  // Check if console.log is called with the correct values
  expect(console.log).toHaveBeenCalledWith({
    email: "test@example.com",
    password: "password123",
  });
});
