
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SignUp from '../components/signup';
import '@testing-library/jest-dom';

// Mock console.log for testing purposes
console.log = jest.fn();

test('renders sign up form', () => {
  render(<SignUp />);

  // Check if the "Sign up" text is present
  const signUpText = screen.getByText(/Sign up/);
  expect(signUpText).toBeInTheDocument();

  // Check if form fields are rendered
  const firstNameField = screen.getByLabelText(/First Name/i);
  expect(firstNameField).toBeInTheDocument();

  const lastNameField = screen.getByLabelText(/Last Name/i);
  expect(lastNameField).toBeInTheDocument();

  const emailField = screen.getByLabelText(/Email Address/i);
  expect(emailField).toBeInTheDocument();

  const passwordField = screen.getByLabelText(/Password/i);
  expect(passwordField).toBeInTheDocument();

  // Check if the "Sign Up" button is rendered
  const signUpButton = screen.getByRole('button', { name: /Sign Up/i });
  expect(signUpButton).toBeInTheDocument();
});


// test('handles form submission', () => {
//     render(<SignUp />);
  
//     // Simulate form submission
//     const form = screen.getByRole('form');
//     fireEvent.submit(form);
  
//     // Check if console.log is called with the correct message
//     expect(console.log).toHaveBeenCalledWith({
//       email: null, // Adjust this based on your expected behavior
//       password: null, // Adjust this based on your expected behavior
//     });
//   });

