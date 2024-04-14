import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import supabase from '../config/supabaseClient';
import VerifyOTP from '../pages/user-verification/index';

  
jest.mock('../config/supabaseClient', () => ({
  auth: {
    verifyOtp: jest.fn(),
    resetPasswordForEmail: jest.fn(),
  },
}));

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('VerifyOTP', () => {

  it('calls resetPasswordForEmail and redirects to the reset password page when verifyOtp resolves', async () => {
    supabase.auth.verifyOtp.mockResolvedValue({});
    const { getByPlaceholderText } = render(<VerifyOTP />);
    const emailInput = getByPlaceholderText('Enter your email');
    const otpInput = getByPlaceholderText('Enter your OTP');
    const verifyButton = screen.getByText('Verify');
  
    fireEvent.change(emailInput, { target: { value: 'nicola@gmail.com' } });
    fireEvent.change(otpInput, { target: { value: '123456' } });
    fireEvent.click(verifyButton);
  
    await waitFor(() => {
      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('nicola@gmail.com');
      expect(window.location.href).toBe('/reset-password');
    });
  });
  

  it('updates the email state when the email input changes', () => {
    const { getByPlaceholderText } = render(<VerifyOTP />);
    const emailInput = getByPlaceholderText('Enter your email');

    fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });

    expect(emailInput.value).toBe('test@gmail.com');
  });

  it('updates the OTP state when the OTP input changes', () => {
    const { getByPlaceholderText } = render(<VerifyOTP />);
    const otpInput = getByPlaceholderText('Enter your OTP');

    fireEvent.change(otpInput, { target: { value: '123456' } });

    expect(otpInput.value).toBe('123456');
  });


  it('calls verifyOtp with the correct values when the form is submitted', async () => {
    const { getByLabelText, getByText } = render(<VerifyOTP />);
    const emailInput = getByLabelText('Email Address');
    const otpInput = getByLabelText('One Time Password');
    const verifyButton = getByText('Verify');

    fireEvent.change(emailInput, { target: { value: 'nicola@gmail.com' } });
    fireEvent.change(otpInput, { target: { value: '123456' } });
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(supabase.auth.verifyOtp).toHaveBeenCalledWith({
        email: 'nicola@gmail.com',
        token: '123456',
        type: 'email',
      });
    });
  });

  it('does not call verifyOtp when the form is submitted with empty fields', async () => {
    const { getByText } = render(<VerifyOTP />);
    const verifyButton = getByText('Verify');

    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(supabase.auth.verifyOtp).not.toHaveBeenCalled();
    });
  });

  it('redirects to the reset password page when verifyOtp resolves', async () => {
    supabase.auth.verifyOtp.mockResolvedValue({});
    const { getByLabelText, getByText } = render(<VerifyOTP />);
    const emailInput = getByLabelText('Email Address');
    const otpInput = getByLabelText('One Time Password');
    const verifyButton = getByText('Verify');

    fireEvent.change(emailInput, { target: { value: 'nicola@gmail.com' } });
    fireEvent.change(otpInput, { target: { value: '123456' } });
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(window.location.href).toBe('/reset-password');
    });
  });

  it('logs an error when verifyOtp rejects', async () => {
    const error = new Error('Failed to verify OTP');
    supabase.auth.verifyOtp.mockRejectedValue(error);
    console.error = jest.fn();
    const { getByLabelText, getByText } = render(<VerifyOTP />);
    const emailInput = getByLabelText('Email Address');
    const otpInput = getByLabelText('One Time Password');
    const verifyButton = getByText('Verify');

    fireEvent.change(emailInput, { target: { value: 'nicola@gmail.com' } });
    fireEvent.change(otpInput, { target: { value: '123456' } });
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error verifying OTP:', error.message);
    });
  });

  it('calls resetPasswordForEmail when verifyOtp resolves', async () => {
    supabase.auth.verifyOtp.mockResolvedValue({});
    const { getByLabelText, getByText } = render(<VerifyOTP />);
    const emailInput = getByLabelText('Email Address');
    const otpInput = getByLabelText('One Time Password');
    const verifyButton = getByText('Verify');

    fireEvent.change(emailInput, { target: { value: 'nicola@gmail.com' } });
    fireEvent.change(otpInput, { target: { value: '123456' } });
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('nicola@gmail.com');
    });
  });

  it('logs an error and redirects to reset password page when verifyOtp or resetPasswordForEmail rejects', async () => {
    const error = new Error('Failed to verify OTP');
    supabase.auth.verifyOtp.mockRejectedValue(error);
    console.error = jest.fn();
    const { getByLabelText, getByText } = render(<VerifyOTP />);
    const emailInput = getByLabelText('Email Address');
    const otpInput = getByLabelText('One Time Password');
    const verifyButton = getByText('Verify');
  
    fireEvent.change(emailInput, { target: { value: 'nicola@gmail.com' } });
    fireEvent.change(otpInput, { target: { value: '123456' } });
    fireEvent.click(verifyButton);
  
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error:', error.message);
      expect(window.location.href).toBe('/reset-password');
    });
  });
  
  it('displays placeholders in the form fields', () => {
    render(<VerifyOTP />);
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const otpInput = screen.getByPlaceholderText('Enter your OTP');

    expect(emailInput).toBeInTheDocument();
    expect(otpInput).toBeInTheDocument();
  });

  it('updates the email state when the email input changes', () => {
    const { getByLabelText } = render(<VerifyOTP />);
    const emailInput = getByLabelText('Email Address');

    fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });

    expect(emailInput.value).toBe('test@gmail.com');
  });

  it('updates the OTP state when the OTP input changes', () => {
    const { getByLabelText } = render(<VerifyOTP />);
    const otpInput = getByLabelText('One Time Password');

    fireEvent.change(otpInput, { target: { value: '123456' } });

    expect(otpInput.value).toBe('123456');
  });

  it('displays an error message when the OTP verification fails', async () => {
    const error = new Error('Failed to verify OTP');
    supabase.auth.verifyOtp.mockRejectedValue(error);
    const { getByPlaceholderText } = render(<VerifyOTP />);
    const emailInput = getByPlaceholderText('Enter your email');
    const otpInput = getByPlaceholderText('Enter your OTP');
    const verifyButton = screen.getByText('Verify');
  
    fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
    fireEvent.change(otpInput, { target: { value: '123456' } });
    fireEvent.click(verifyButton);
  
    await waitFor(() => {
      const errorMessage = screen.getByText(/Failed to verify OTP/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });
  

});