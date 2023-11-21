import React from 'react';
import { render, screen, fireEvent,waitFor} from '@testing-library/react';
import UserLogin from '../components/userauthentication/UserLogin'
import { MemoryRouter, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';



jest.mock('axios')
const mockGetItem = jest.fn();
const mockSetItem = jest.fn();
const mockRemoveItem = jest.fn();

Object.defineProperty(window, "localStorage", {
  value: {
    getItem: function (...args) {
      return mockGetItem(...args);
    },
    setItem: function (...args) {
      return mockSetItem(...args);
    },
    removeItem: function (...args) {
      return mockRemoveItem(...args);
    },
  },
});

describe('UserLogin Component', () => {
   
     
    test('render userlogin component', async () => { 
  
      render(
      <MemoryRouter>
      <UserLogin />
      </MemoryRouter>);
    
    });
    test('handles form submission successfully', async () => {
        axios.post.mockResolvedValue({ data: { message: 'Login Successfully' } });
        render(<MemoryRouter>
            <UserLogin />
            </MemoryRouter>);

        fireEvent.change(screen.getByPlaceholderText(/User Name/i), { target: { value: 'testUser' } });
        const passwordInput = screen.getByPlaceholderText('Password');
        fireEvent.change(passwordInput, { target: { value: 'testUserPassword' } });

        jest.spyOn(Storage.prototype, 'setItem');
        Storage.prototype.setItem = jest.fn();

        jest.spyOn(Storage.prototype,'getItem')
        Storage.prototype.getItem=jest.fn()

        fireEvent.click(screen.getByText(/Sign in/i));
        await waitFor(() => {
            screen.findByText(/Login Successfully/i)
         
        });
       
    });

    test('Username is required', async () => {
        axios.post.mockResolvedValue({ data: { message: 'Username is required' } });
        render(<MemoryRouter>
            <UserLogin />
            </MemoryRouter>);
       
        const passwordInput = screen.getByPlaceholderText('Password');
        fireEvent.change(passwordInput, { target: { value: 'testUserPassword' } });
    
        fireEvent.click(screen.getByText(/Sign in/i));
        await waitFor(() => {
            screen.findByText(/Username is required/i)
         
        });
    });
    test('Password is required', async () => {
        axios.post.mockResolvedValue({ data: { message: 'Password is required' } });
        render(<MemoryRouter>
            <UserLogin />
            </MemoryRouter>);
       
        fireEvent.change(screen.getByPlaceholderText(/User Name/i), { target: { value: 'testUser' } }); 
        fireEvent.click(screen.getByText(/Sign in/i));
        await waitFor(() => {
            screen.findByText(/Password is required/i)
         
        });
    });
    test('renders login form with default state', () => {
        render(<UserLogin />, { wrapper: MemoryRouter });
    
        const userNameInput = screen.getByTestId('user-name-input');
        const passwordInput = screen.getByPlaceholderText('Password');
        const signinButton = screen.getByRole('button', { name: /signin/i });
        const forgetPasswordLink = screen.getByText(/forget password/i);
    
        expect(userNameInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(signinButton).toBeInTheDocument();
        expect(forgetPasswordLink).toBeInTheDocument();
      });

      test('handles incorrect login credentials', async () => {
        axios.post.mockRejectedValueOnce({ message: 'Invalid credentials' });
    
        render(<MemoryRouter><UserLogin /></MemoryRouter>);
    
        
        fireEvent.change(screen.getByPlaceholderText(/User Name/i), { target: { value: 'invalidUser' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'invalidPassword' } });
    
        fireEvent.click(screen.getByText(/Signin/i));
    
        await waitFor(() => {
            screen.findByText(/Invalid credentials/i)
        });
        
    });

    test("toggles password visibility", async() => {
        render(<MemoryRouter><UserLogin /></MemoryRouter>);
    
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
  
    test('forget password', async () => {
        render(<MemoryRouter><UserLogin /></MemoryRouter>);
        screen.findByText(/Forget Password?/i);
      
    });
    test('handles successful login', async () => {
        axios.post.mockResolvedValueOnce({
            data: {
                message: 'Login Successfully',
                access_token: 'fakeAccessToken',
                refresh_token: 'fakeRefreshToken',
            },
        });
    
        render(<MemoryRouter><UserLogin /></MemoryRouter>);

        fireEvent.change(screen.getByPlaceholderText(/User Name/i), { target: { value: 'testUser' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'testUserPassword' } });
        fireEvent.click(screen.getByText(/Signin/i));

        await waitFor(() => {
            screen.findByText(/Login Successfully/i)
        });
        expect(mockSetItem).toHaveBeenCalledTimes(1);
    });

    
})