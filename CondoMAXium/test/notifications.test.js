import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { BrowserRouter as Router } from 'react-router-dom';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import supabase from '../config/supabaseClient';
import NotificationsPage from '../pages/notifications/index';

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
  }));
  
  
  jest.mock('../config/supabaseClient', () => ({
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
  }));
  
  describe('NotificationsPage', () => {
    beforeEach(() => {
      useRouter.mockImplementation(() => ({
        push: jest.fn(),
      }));
    });
    it('fetchNotifications sets user data correctly on successful fetch', async () => {
      // Mocking the response from supabase.auth.getUser()
      const mockUserData = { id: 1, name: 'John Doe' };
      supabase.auth.getUser.mockResolvedValueOnce({ data: { user: mockUserData } });
  
      // Execute the function
      await fetchNotifications();
  
      // Check if setUserData was called with the correct data
      expect(mockSetUserData).toHaveBeenCalledWith(mockUserData);
    });

    it('calls handleNotificationSelect when a notification is clicked', async () => {
      const { getByText } = render(<NotificationsPage />);
      const notificationItem = getByText(/An update on your request has been made/i);
  
      fireEvent.click(notificationItem);
  
      await waitFor(() => {
        expect(getByText(/From: CMC/i)).toBeInTheDocument();
      });
    });
  
  
    it('navigates to dashboard on dashboard button click', async () => {
        const { findByRole } = render(<NotificationsPage />);
        const dashboardButton = await findByRole('button', { name: /dashboard/i });
      
        fireEvent.click(dashboardButton);
      
        expect(useRouter().push).toHaveBeenCalledWith('/dashboard');
      });

    it('navigates to profile on profile button click', async () => {
        const { findByRole } = render(<NotificationsPage />);
        const profileButton = await findByRole('button', { name: /profile/i });
      
        fireEvent.click(profileButton);
      
        expect(useRouter().push).toHaveBeenCalledWith('/profile');
    });

  });