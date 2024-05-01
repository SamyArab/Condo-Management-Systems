import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import "@testing-library/jest-dom";
import { useRouter } from 'next/router';
// import { createTheme, ThemeProvider } from "@mui/material/styles";
import supabase from '../config/supabaseClient';
import SignInSide from '../pages/login/index';
import { Password } from '@mui/icons-material';

jest.mock('next/router', () => ({
    useRouter: () => ({
      push: jest.fn()
    }),
}));

  
jest.mock('../config/supabaseClient', () => ({
    auth: {
      signInWithPassword: jest.fn()
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockImplementation(() => ({
        single: jest.fn().mockResolvedValue({
          data: { roleOfUser: 'owner' },
          error: null
        })
      }))
    }))
  }));

// jest.mock('../config/supabaseClient', () => ({
//     auth: {
//       signInWithPassword: jest.fn()
//     },
//     from: jest.fn(() => ({
//       select: jest.fn().mockReturnThis(),
//       eq: jest.fn()
//     }))
// }));

describe('SignInSide Component', () => {
    test('renders sign in form with all inputs and buttons', () => {
      render(<SignInSide />);

      expect(screen.getByText('Email Address')).toBeInTheDocument();
      expect(screen.getByText('Password')).toBeInTheDocument();
      expect(screen.getByText('Sign In')).toBeInTheDocument();
      expect(screen.getByText("Don't have an account? Sign Up")).toBeInTheDocument();
    });

    test('submits form data and handles sign in', async () => {
        // const mockRouter = useRouter();
        const role = 'owner';
        supabase.auth.signInWithPassword.mockResolvedValue({
          data: { user: { email: 'test@example.com' }, session: {} },
          error: null
        });
        // supabase.from.mockImplementation((tableName) => {
        //     if (tableName === "profiles") {
        //       return {
        //         select: jest.fn().mockReturnThis(),
        //         eq: jest.fn().mockResolvedValue({
        //           data: [{ 

        //             roleOfUser: 'owner',
        //           }],
        //           error: null
        //         })
        //       };
        //     }
        //     return {
        //       select: jest.fn().mockReturnThis(),
        //       eq: jest.fn()
        //     };
        //   });
      
        const {getByRole, getByText, getByTestId} = render(<SignInSide />);

        fireEvent.change(getByRole('textbox', {name: 'Email Address'}), { target: { value: 'test@example.com' } });
        const passw = await screen.findByDisplayValue('');
        expect(passw).toBeInTheDocument();
        expect(passw).toHaveAttribute('name', 'password')
        fireEvent.change(passw, { target: { value: 'password123' } });
        expect(passw).toHaveValue('password123');
        fireEvent.click(screen.getByText('Sign In'));
      
        await waitFor(() => {
          expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'password123'
          });
          expect(screen.getByText('Dashboard')).toBeInTheDocument(); // Verifies the router was called correctly
        });
    });
      
    //   test('handles sign in errors', async () => {
    //     supabase.auth.signInWithPassword.mockResolvedValue({
    //       data: null,
    //       error: { message: 'Invalid login credentials' }
    //     });
      
    //     render(<SignInSide />);
    //     fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'wrong@example.com' } });
    //     fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpassword' } });
    //     fireEvent.click(screen.getByText('Sign In'));
      
    //     await waitFor(() => {
    //       expect(screen.getByText('Error logging in: Invalid login credentials')).toBeInTheDocument();
    //     });
    //   });
      
});
  


// // Mock console.error to throw an error
// console.error = jest.fn().mockImplementation(() => {
//     throw new Error('console.error called');
// });

// // Mock console.error to spy on it
// const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

// // Mock window.alert
// const mockAlert = jest.fn();
// global.alert = mockAlert;

// // Mock console.log to do nothing
// console.log = jest.fn();

// describe('SignInSide Component', () => {

//     // Clearing useRouter mock before each test
//     beforeEach(() => {
//         useRouter.mockClear();
//     });

//     // Clearing all mocks after each test
//     afterEach(() => {
//         jest.clearAllMocks();
//     });

//     // This test is for the page in general
//     test('renders the SignInSide component without errors', () => {
//         useRouter.mockReturnValue({ query: {}})
//         render(<SignInSide />);
//     });

//     // This test is for most of the lines for the page
//     test('submits form and signs in user successfully', async () => {
//         // Mocking router push function
//         const mockRouter = {
//             push: jest.fn(),
//         };
//         useRouter.mockReturnValue(mockRouter);

//         // Render the SignInSide component
//         const { getByLabelText, getByText } = render(<SignInSide />);

//         // Fill out form fields
//         fireEvent.change(getByLabelText(/Email Address/i), { target: { value: 'nicola@gmail.com' } });
//         fireEvent.change(getByLabelText(/Password/i), { target: { value: '123456' } });

//         // Mock successful sign-in response
//         const signInResponse = { data: 'mocked user data', error: null };
//         supabase.auth.signInWithPassword.mockResolvedValueOnce(signInResponse);

//         // Act
//         fireEvent.click(getByText('Sign In'));

//         // Assert
//         await waitFor(() => {
//             expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
//                 email: 'nicola@gmail.com',
//                 password: '123456',
//             });
//             // Check if console error was called
//             expect(console.error).not.toHaveBeenCalled();

//             // Check if console log was called properly and successfully
//             expect(console.log).toHaveBeenCalledWith('User logged in succesfully:', 'mocked user data');
//         });
//     });

//     // This test is for line(s): 106 (handleSubmit the catch)
//     test('shows alert and logs error message if sign in fails due to invalid credentials', async () => {

//         // Mocking invalid credentials error
//         const mockedError = new Error('Invalid credentials');
//         mockedError.status = 401;
//         supabase.auth.signInWithPassword.mockRejectedValueOnce(mockedError);

//         // Mocking router push function
//         const mockRouter = {
//             push: jest.fn(),
//         };
//         useRouter.mockReturnValue(mockRouter);

//         // Render the SignInSide component
//         const { getByLabelText, getByText } = render(<SignInSide />);

//         // Fill out form fields
//         fireEvent.change(getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
//         fireEvent.change(getByLabelText(/Password/i), { target: { value: 'invalidpassword' } });

//         // Act
//         fireEvent.click(getByText('Sign In'));

//         // Assert: Wait for the async operations to finish
//         await waitFor(() => {

//             // Check if console.error was called
//             expect(consoleErrorSpy).toHaveBeenCalledWith('Error logging in:', 'Invalid credentials');

//             // Check if console.log was not called
//             expect(console.log).not.toHaveBeenCalled();

//             // Assert that alert is shown with correct message
//             // expect(mockAlert).toHaveBeenCalledWith('Error logging in: Invalid credentials');

//             // Check if router push function was not called
//             // expect(mockRouter.push).not.toHaveBeenCalled();
//         });
//     });

//     test('handles error during sign in', async () => {
//         // Mocking router push function
//         const mockRouter = {
//             push: jest.fn(),
//         };
//         useRouter.mockReturnValue(mockRouter);

//         // Render the SignInSide component
//         const { getByLabelText, getByText } = render(<SignInSide />);

//         // Fill out form fields
//         fireEvent.change(getByLabelText(/Email Address/i), { target: { value: 'nicola@gmail.com' } });
//         fireEvent.change(getByLabelText(/Password/i), { target: { value: '123456' } });

//         // Mock sign-in response with an error
//         const signInResponse = { data: null, error: new Error('Sign-in failed') };
//         supabase.auth.signInWithPassword.mockResolvedValueOnce(signInResponse);

//         // Act
//         fireEvent.click(getByText('Sign In'));

//         // Assert
//         await waitFor(() => {
//             // Ensure that router.push('/') is called
//             expect(mockRouter.push).toHaveBeenCalledWith("/");

//             // Ensure that the error is thrown
//             expect(console.error).toHaveBeenCalledWith('Error logging in:', signInResponse.error.message);
//         });
//     });

//     test('covers theme mode condition', () => {
//         // Define a theme with mode set to 'light'
//         const lightTheme = createTheme({
//             palette: {
//                 mode: 'light',
//             },
//         });

//         // Render the SignInSide component wrapped in the ThemeProvider with light theme
//         render(
//             <ThemeProvider theme={lightTheme}>
//                 <SignInSide />
//             </ThemeProvider>
//         );

//         // Ensure that the condition t.palette.mode === "light" is met
//         // This line is covered because it's triggered by the provided theme mode
//     });


// });
