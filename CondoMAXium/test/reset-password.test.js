import { render, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import supabase from "../config/supabaseClient";
import ResetPassword from '../pages/reset-password/index';
import React from 'react';

console.error = jest.fn();
window.alert = jest.fn();

jest.mock("../config/supabaseClient", () => ({
  auth: {
    updateUser: jest.fn(),
  },
}));

const mockedStyles = {};
jest.mock('../styles/units.module.css', () => ({
  ...mockedStyles,
}));

// Mock useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

describe('ResetPassword', () => {
    it('renders correctly', () => {
      const { getByRole } = render(<ResetPassword />);
      expect(getByRole('heading', { name: /Reset Password/i })).toBeInTheDocument();
    });
  
    it('calls the password reset function when form is submitted', async () => {
      const { getByLabelText, getByRole } = render(<ResetPassword />);
      const newPasswordInput = getByLabelText('New Password');
      const resetButton = getByRole('button', { name: /Reset Password/i });
  
      fireEvent.change(newPasswordInput, { target: { value: 'newPassword' } });
      fireEvent.click(resetButton);
  
      await waitFor(() => {
        expect(supabase.auth.updateUser).toHaveBeenCalledWith({
          password: 'newPassword',
        });
      });
    });
  
    it('does not call the password reset function when the password field is empty', async () => {
      const { getByLabelText, getByRole } = render(<ResetPassword />);
      const newPasswordInput = getByLabelText('New Password');
      const resetButton = getByRole('button', { name: /Reset Password/i });
  
      fireEvent.change(newPasswordInput, { target: { value: '' } });
      fireEvent.click(resetButton);
  
      await waitFor(() => {
        expect(supabase.auth.updateUser).not.toHaveBeenCalled();
      });
    });
  
    it('displays an error message when the password reset fails', async () => {
      supabase.auth.updateUser.mockRejectedValueOnce(new Error('Failed to reset password'));
  
      const { getByLabelText, getByRole, findByText } = render(<ResetPassword />);
      const newPasswordInput = getByLabelText('New Password');
      const resetButton = getByRole('button', { name: /Reset Password/i });
  
      fireEvent.change(newPasswordInput, { target: { value: 'newPassword' } });
      fireEvent.click(resetButton);
  
      const errorMessage = await findByText(/Failed to reset password/);
      expect(errorMessage).toBeInTheDocument();
    });
  
    it('calls the password reset function when form is submitted', async () => {
        const { getByPlaceholderText, getByRole } = render(<ResetPassword />);
        const newPasswordInput = getByPlaceholderText('New Password');
        const resetButton = getByRole('button', { name: /Reset Password/i });
      
        fireEvent.change(newPasswordInput, { target: { value: 'newPassword' } });
        fireEvent.click(resetButton);
      
        await waitFor(() => {
          expect(supabase.auth.updateUser).toHaveBeenCalledWith({
            password: 'newPassword',
          });
        });
      });
      
      it('calls the password reset function when form is submitted', async () => {
        const { queryAllByRole, getByRole } = render(<ResetPassword />);
        const inputFields = queryAllByRole('input'); // Selects all input fields
        const newPasswordInput = inputFields.find(input => input.type === 'password'); // Selects the password input field
        const resetButton = getByRole('button', { name: /Reset Password/i });
      
        fireEvent.change(newPasswordInput, { target: { value: 'newPassword' } });
        fireEvent.click(resetButton);
      
        await waitFor(() => {
          expect(supabase.auth.updateUser).toHaveBeenCalledWith({
            password: 'newPassword',
          });
        });
      });

      it('calls the password reset function when form is submitted', async () => {
        const { container, getByRole } = render(<ResetPassword />);
        const newPasswordInput = container.querySelector('input[type="password"]'); // Selects the password input field
        const resetButton = getByRole('button', { name: /Reset Password/i });
      
        fireEvent.change(newPasswordInput, { target: { value: 'newPassword' } });
        fireEvent.click(resetButton);
      
        await waitFor(() => {
          expect(supabase.auth.updateUser).toHaveBeenCalledWith({
            password: 'newPassword',
          });
        });
      });
      
      it('calls the password reset function when form is submitted', async () => {
        const { getByPlaceholderText, getByRole } = render(<ResetPassword />);
        const newPasswordInput = getByPlaceholderText('New Password');
        const resetButton = getByRole('button', { name: /Reset Password/i });
      
        fireEvent.change(newPasswordInput, { target: { value: 'newPassword' } });
        fireEvent.click(resetButton);
      
        await waitFor(() => {
          expect(supabase.auth.updateUser).toHaveBeenCalledWith({
            password: 'newPassword',
          });
        });
      });

      it('displays an error message when the password reset fails', async () => {
        supabase.auth.updateUser.mockRejectedValueOnce(new Error('Failed to reset password'));
      
        const { getByPlaceholderText, getByRole } = render(<ResetPassword />);
        const newPasswordInput = getByPlaceholderText('New Password');
        const resetButton = getByRole('button', { name: /Reset Password/i });
      
        fireEvent.change(newPasswordInput, { target: { value: 'newPassword' } });
        fireEvent.click(resetButton);
      
        await waitFor(() => {
          expect(supabase.auth.updateUser).toHaveBeenCalledWith({
            password: 'newPassword',
          });
        });
      
        // Check that the error was thrown
        expect(supabase.auth.updateUser).toThrowError('Failed to reset password');
      });
      
      it('displays an error message when the password reset fails', async () => {
        supabase.auth.updateUser.mockRejectedValueOnce(new Error('Failed to reset password'));
      
        const { getByPlaceholderText, getByRole } = render(<ResetPassword />);
        const newPasswordInput = getByPlaceholderText('New Password');
        const resetButton = getByRole('button', { name: /Reset Password/i });
      
        fireEvent.change(newPasswordInput, { target: { value: 'newPassword' } });
        fireEvent.click(resetButton);
      
        await waitFor(() => {
          expect(console.error).toHaveBeenCalledWith('Error resetting password:', 'Failed to reset password');
        });
      });
      
      it('shows an alert and redirects to the home page when the password reset is successful', async () => {
        supabase.auth.updateUser.mockResolvedValueOnce({});
      
        const push = jest.fn();
        useRouter.mockImplementation(() => ({ push }));
      
        const { getByPlaceholderText, getByRole } = render(<ResetPassword />);
        const newPasswordInput = getByPlaceholderText('New Password');
        const resetButton = getByRole('button', { name: /Reset Password/i });
      
        fireEvent.change(newPasswordInput, { target: { value: 'newPassword' } });
        fireEvent.click(resetButton);
      
        await waitFor(() => {
          expect(window.alert).toHaveBeenCalledWith('Password reset succeeded!');
          expect(push).toHaveBeenCalledWith('/');
        });
      });  
      
      it('logs an error and returns when there is an issue resetting the password', async () => {
        // Mock the updateUser function to reject with an error
        supabase.auth.updateUser.mockRejectedValueOnce(new Error('Failed to reset password'));
      
        // Spy on console.error
        const consoleSpy = jest.spyOn(console, 'error');
      
        const { getByPlaceholderText, getByRole } = render(<ResetPassword />);
        const newPasswordInput = getByPlaceholderText('New Password');
        const resetButton = getByRole('button', { name: /Reset Password/i });
      
        // Simulate user actions
        fireEvent.change(newPasswordInput, { target: { value: 'newPassword' } });
        fireEvent.click(resetButton);
      
        // Wait for any asynchronous actions to complete
        await waitFor(() => {
          // Check if console.error was called with the correct arguments
          expect(consoleSpy).toHaveBeenCalledWith('Error resetting password:', 'Failed to reset password');
        });
      
        // Clean up the console spy
        consoleSpy.mockRestore();
      });      
      
      
  });
