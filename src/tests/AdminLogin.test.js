import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Adminlogin from '../components/admincomponents/adminlogin/AdminLogin';
import { adminLogin } from '../services/ApiServices';
import { useNavigate,MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';


jest.mock('../services/ApiServices', () => ({
    ...jest.requireActual('../services/ApiServices'),
    adminLogin: jest.fn()
}))
jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));


describe('AdminLogin Component', () => {
    test('render adminlogin component', async () => {

        render(<Adminlogin />);
    });
    test('handles form submission successfully', async () => {
        adminLogin.mockResolvedValue({ data: { message: 'Login Successful' } });

        const mockNavigate = jest.fn();
        useNavigate.mockReturnValue(mockNavigate);

        render(
            <Adminlogin />
        );

        fireEvent.change(screen.getByPlaceholderText(/Enter Username/i), { target: { value: 'testAdmin' } });

        const passwordInput = screen.getByPlaceholderText('Enter password');
        fireEvent.change(passwordInput, { target: { value: 'testAdminPassword' } });

        fireEvent.click(screen.getByText('Login'));
        await waitFor(() => {
            screen.findByText(/Login Successful/i)
            expect(mockNavigate).toHaveBeenCalledWith('/admindashboard');

        });
    });

    test("toggles password visibility", async() => {
        render(<Adminlogin />);
    
        const passwordInput = screen.getByPlaceholderText("Enter password");
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


    test('handles error when admin login fails', async () => {
        adminLogin.mockRejectedValueOnce(('Admin login failed'));
 
        render(
            <Adminlogin />
         
        );
        const usernameInput = screen.getByPlaceholderText('Enter Username');
        fireEvent.change(usernameInput, { target: { value: 'admin' } });
    
        const passwordInput = screen.getByPlaceholderText('Enter password');
        fireEvent.change(passwordInput, { target: { value: 'adminPassword' } });
    
        const loginButton = screen.getByText('Login');
        fireEvent.click(loginButton);
        await waitFor(() => {
          expect(adminLogin).toHaveBeenCalledWith({
            username: 'admin',
            password: 'adminPassword',
          });

          expect(screen.findByText('Admin login failed'))
        });
      });
})