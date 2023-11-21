import React from 'react';
import { render, screen, fireEvent,waitFor,act } from '@testing-library/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserSignup from '../components/userauthentication/UserSignup';
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event';


jest.mock('axios');
jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));
describe('UserSignup component', () => {
    beforeEach(() => {

        jest.clearAllMocks();
    });

    test('renders signup form', () => {
        render(<UserSignup />);
    });

    test('handles form submission successfully', async () => {
        axios.post.mockResolvedValue({ data: { message: 'Registered Successfully' } });

        const mockNavigate = jest.fn();
        useNavigate.mockReturnValue(mockNavigate);
        render(<UserSignup />);

        fireEvent.change(screen.getByPlaceholderText(/User Name/i), { target: { value: 'testUser' } });
        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'testUser@gmail.com' } })
       
        const passwordInput = screen.getByPlaceholderText('Password');
        const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
        
        expect(passwordInput).toBeVisible();
        expect(confirmPasswordInput).toBeVisible();
        fireEvent.change(passwordInput, { target: { value: 'testUserPassword' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'testUserPassword' } });

        fireEvent.click(screen.getByText(/Register/i));
        await screen.findByText(/Registered Successfully/i);
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    test("toggles password visibility", async() => {
        render(<UserSignup />);
    
        const passwordInput = screen.getByPlaceholderText("Password");
        expect(passwordInput.type).toBe("password");

        const showPasswordButton = document.querySelector('.password-toggle');
        userEvent.click(showPasswordButton);
    
        await waitFor(() => {
            expect(passwordInput.type).toBe("text");
          });
          userEvent.click(showPasswordButton);

          await waitFor(() => {
            expect(passwordInput.type).toBe("password");
          });

      });

    test('password mismatch', async () => {
        axios.post.mockResolvedValue({ data: { message: 'Password does not match' } });
        render(<UserSignup />);
       
        fireEvent.click(screen.getByText(/Register/i));
        await screen.findByText(/Password does not match/i);
        
    });

    test('Username already in use', async () => {
        axios.post.mockResolvedValue({ data: { message: 'Username already in use' } });
        render(<UserSignup />);
       
        fireEvent.click(screen.getByText(/Register/i));
        await screen.findByText(/Username already in use/i);
        
    });

    test('Email Already Exists', async () => {
        axios.post.mockResolvedValue({ data: { message: 'Email Already Exists' } });
        render(<UserSignup />);
       
        fireEvent.click(screen.getByText(/Register/i));
        await screen.findByText(/Email Already Exists/i);
        
    });


    test('Username is required', async () => {
        axios.post.mockResolvedValue({ data: { message: 'Username is required' } });
        render(<UserSignup />);
       
        fireEvent.click(screen.getByText(/Register/i));
        await screen.findByText(/Username is required/i);
        
    });


    test('Password is required', async () => {
        axios.post.mockResolvedValue({ data: { message: 'Password is required' } });
        render(<UserSignup />);
       
        fireEvent.click(screen.getByText(/Register/i));
        await screen.findByText(/Password is required/i);
        
    });


    test('Please confirm the password', async () => {
        axios.post.mockResolvedValue({ data: { message: 'Please confirm the password' } });
        render(<UserSignup />);
       
        fireEvent.click(screen.getByText(/Register/i));
        await screen.findByText(/Please confirm the password/i);
        
    });

    test('Email is required', async () => {
        axios.post.mockResolvedValue({ data: { message: 'Email is required' } });
        render(<UserSignup />);
       
        fireEvent.click(screen.getByText(/Register/i));
        await screen.findByText(/Email is required/i);
        
    });

    test('All fields are required', async () => {
        axios.post.mockResolvedValue({ data: { message: 'All fields are required' } });
        render(<UserSignup />);
       
        fireEvent.click(screen.getByText(/Register/i));
        await screen.findByText(/All fields are required/i);
        
    });
    test('User registration with valid data', async () => {
       
        axios.post.mockResolvedValue({
          data: {
            message: 'Registered Successfully',
          },
        });
    
        render(<UserSignup />);
    
      
        fireEvent.change(screen.getByPlaceholderText('User Name'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password123' } });
    
       
        fireEvent.click(screen.getByText('Register'));
        await screen.findByText('Registered Successfully');
        expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('signup'), {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          confirm_password: 'password123',
        });
      });
      test('handles user registration failure and shows alert', async () => {
        const errorMessage = 'User Registration failed: Test error message';
        const alertSpy = jest.spyOn(window, 'alert');
        axios.post.mockRejectedValue('Test error message');
    
        render(<UserSignup />);
        fireEvent.click(screen.getByText(/Register/i));
        await waitFor(()=>{
            expect(alertSpy).toHaveBeenCalled();
        })
       
      }); 

      test('handles responseMessage as an array', async () => {
        const mockResponse = {
          data: {
            message: ['Error 1', 'Error 2'],
          },
        };
        axios.post.mockResolvedValue(mockResponse);
        render(<UserSignup />)
        fireEvent.click(screen.getByText('Register'));
          await waitFor(() => {
            expect(screen.getByText('Error 1 Error 2')).toBeInTheDocument();
          });
      });
    })
