import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import supabase from '../config/supabaseClient';
import VerifyOTP from '../pages/user-verification/index';


jest.mock('../config/supabaseClient', () => ({
  auth: {
    verifyOtp: jest.fn(),
  },
}));

jest.mock('next/router', () => ({
    useRouter: () => ({
      push: jest.fn(),
    }),
  }));
  
  describe('VerifyOTP', () => {
    it('calls verifyOtp with the correct values when the form is submitted', async () => {
      const { getByLabelText, getByText } = render(<VerifyOTP />);
      const emailInput = getByLabelText('Email:');
      const otpInput = getByLabelText('OTP:');
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
  
    it('redirects to the profile form page when verifyOtp resolves', async () => {
      supabase.auth.verifyOtp.mockResolvedValue({});
      const { getByLabelText, getByText } = render(<VerifyOTP />);
      const emailInput = getByLabelText('Email:');
      const otpInput = getByLabelText('OTP:');
      const verifyButton = getByText('Verify');
  
      fireEvent.change(emailInput, { target: { value: 'nicola@gmail.com' } });
      fireEvent.change(otpInput, { target: { value: '123456' } });
      fireEvent.click(verifyButton);
  
      await waitFor(() => {
        expect(window.location.href).toBe('/profile-form');
      });
    });
  
    it('logs an error when verifyOtp rejects', async () => {
      const error = new Error('Failed to verify OTP');
      supabase.auth.verifyOtp.mockRejectedValue(error);
      console.error = jest.fn();
      const { getByLabelText, getByText } = render(<VerifyOTP />);
      const emailInput = getByLabelText('Email:');
      const otpInput = getByLabelText('OTP:');
      const verifyButton = getByText('Verify');
  
      fireEvent.change(emailInput, { target: { value: 'nicola@gmail.com' } });
      fireEvent.change(otpInput, { target: { value: '123456' } });
      fireEvent.click(verifyButton);
  
      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith('Error verifying OTP:', error.message);
      });
    });
  });

  it("logs an error and does not redirect when verifyOtp fails", async () => {
    const error = new Error("Failed to verify OTP");
    supabase.auth.verifyOtp.mockRejectedValue(error);
    console.error = jest.fn();
    const { getByLabelText, getByText } = render(<VerifyOTP />);
    const emailInput = getByLabelText("Email:");
    const otpInput = getByLabelText("OTP:");
    const verifyButton = getByText("Verify");

    fireEvent.change(emailInput, { target: { value: "nicola@gmail.com" } });
    fireEvent.change(otpInput, { target: { value: "123455556" } });
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(error.message);
      expect(supabase.auth.verifyOtp).toHaveBeenCalledWith({
        email: "nicola@gmail.com",
        token: "123455556",
        type: "email",
      });
      expect(window.location.href).not.toBe("/profile-form");
    });
  });
  
  it('logs an error when the OTP is expired', async () => {
    const error = new Error('OTP expired');
    supabase.auth.verifyOtp.mockRejectedValue(error);
    console.error = jest.fn();
    const { getByLabelText, getByText } = render(<VerifyOTP />);
    const emailInput = getByLabelText('Email:');
    const otpInput = getByLabelText('OTP:');
    const verifyButton = getByText('Verify');
  
    fireEvent.change(emailInput, { target: { value: 'nicola@gmail.com' } });
    fireEvent.change(otpInput, { target: { value: '123456' } });
    fireEvent.click(verifyButton);
  
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error verifying OTP:', error.message);
    });
  });
  
  
  // Test for verifyOtp function delay
  jest.useFakeTimers();
  it('shows a spinner when verifyOtp is taking a long time', () => {
    supabase.auth.verifyOtp.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 5000)));
    const { getByLabelText, getByText } = render(<VerifyOTP />);
    const emailInput = getByLabelText('Email:');
    const otpInput = getByLabelText('OTP:');
    const verifyButton = getByText('Verify');
  
    fireEvent.change(emailInput, { target: { value: 'nicola@gmail.com' } });
    fireEvent.change(otpInput, { target: { value: '123456' } });
    fireEvent.click(verifyButton);
  
    jest.advanceTimersByTime(1000);
    // Add a check for a loading spinner here
  });
  jest.useRealTimers();
  
  // Test for empty email field
it('does not call verifyOtp when the email field is empty', async () => {
    const { getByLabelText, getByText } = render(<VerifyOTP />);
    const otpInput = getByLabelText('OTP:');
    const verifyButton = getByText('Verify');
  
    fireEvent.change(otpInput, { target: { value: '123456' } });
    fireEvent.click(verifyButton);
  
    await waitFor(() => {
      expect(supabase.auth.verifyOtp).not.toHaveBeenCalled();
    });
  });
  
  it('logs an error when verifyOtp rejects', async () => {
    const error = new Error('Failed to verify OTP');
    supabase.auth.verifyOtp.mockImplementation(() => Promise.reject(error));
    console.error = jest.fn();
    const { getByLabelText, getByText } = render(<VerifyOTP />);
    const emailInput = getByLabelText('Email:');
    const otpInput = getByLabelText('OTP:');
    const verifyButton = getByText('Verify');
  
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(otpInput, { target: { value: '123456' } });
    fireEvent.click(verifyButton);
  
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error verifying OTP:', error.message);
    });
  });

  
 // Test for successful OTP verification
it('redirects to the profile form page when verifyOtp resolves', async () => {
    supabase.auth.verifyOtp.mockResolvedValue({});
    const { getByLabelText, getByText } = render(<VerifyOTP />);
    const emailInput = getByLabelText('Email:');
    const otpInput = getByLabelText('OTP:');
    const verifyButton = getByText('Verify');
  
    fireEvent.change(emailInput, { target: { value: 'nicola@gmail.com' } });
    fireEvent.change(otpInput, { target: { value: '123456' } });
    fireEvent.click(verifyButton);
  
    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith('/profile-form');
    });
  });
  
  // Test for failed OTP verification
  it('logs an error when verifyOtp rejects', async () => {
    const error = new Error('Failed to verify OTP');
    supabase.auth.verifyOtp.mockRejectedValue(error);
    console.error = jest.fn();
    const { getByLabelText, getByText } = render(<VerifyOTP />);
    const emailInput = getByLabelText('Email:');
    const otpInput = getByLabelText('OTP:');
    const verifyButton = getByText('Verify');
  
    fireEvent.change(emailInput, { target: { value: 'nicola@gmail.com' } });
    fireEvent.change(otpInput, { target: { value: '123456' } });
    fireEvent.click(verifyButton);
  
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error verifying OTP:', error.message);
    });
  });
  
  
  afterEach(() => jest.clearAllMocks());