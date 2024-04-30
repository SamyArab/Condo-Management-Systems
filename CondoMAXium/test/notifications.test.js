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









// describe('NotificationsPage Component', () => {

//     // Clearing useRouter mock before each test
//     beforeEach(() => {
//         useRouter.mockImplementation(() => ({
//           push: jest.fn(),
//         }));
//       });

//     // Clearing all mocks after each test
//     afterEach(() => {
//         jest.clearAllMocks();
//     });

//     // This test is for the page in general
//     test('renders the NotificationsPage component without errors', () => {
//         useRouter.mockReturnValue({ query: {} })
//         render(<NotificationsPage />);
//     });

    

//     // test('show details section when notification is clicked', async () => {
//     //     const { getByPlaceholderText, getByText } = render(
//     //         <Router>
//     //             <NotificationsPage />
//     //         </Router>
//     //     );
//     //     const selectButton = getByPlaceholderText('Select Notification');

//     //     fireEvent.click(selectButton);
//     //     await waitFor(() => {
//     //         expect(getByText('From:')).toBeInTheDocument();
//     //     });
//     // });      
     
// });


