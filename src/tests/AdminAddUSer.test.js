import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddUserForm from '../components/admincomponents/adminadduser/AddUserForm';
import userEvent from '@testing-library/user-event';
import { addUserAccount } from '../services/ApiServices';
import { useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';


jest.mock('../services/ApiServices', () => ({
    ...jest.requireActual('../services/ApiServices'),
    addUserAccount: jest.fn()
}))
jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));


describe('AddUserForm Component', () => {
    test('render AddUserForm component', async () => {

        render(<AddUserForm />);
    });

    test('Add Manager', async () => {
        addUserAccount.mockResolvedValue({ data: { message: 'New Manager is Added Successfully' } });
        render(<AddUserForm />);
        addUserAccount.mockResolvedValue({ data: { message: 'New Manager is Added Successfully' } });

        const accountTypeElement = screen.getByText(/Account Type/i);
        const accountTypeText = accountTypeElement.textContent;
        expect(accountTypeText).toBe('Account Type');

        screen.findByText(/Add User/i)

        fireEvent.click(screen.getByRole('button', { name: /Add User/i }));

        expect(addUserAccount).toHaveBeenCalledWith(expect.objectContaining({
            username: expect.any(String),
            email: expect.any(String),
            password: expect.any(String),
            confirm_password: expect.any(String),
            user_type: '1',
        }));
        await waitFor(() => {
            screen.findByText(/New Manager is Added Successfully/i)
        });
    })
    test('Add Staff', async () => {
        addUserAccount.mockResolvedValue({ data: { message: 'New Staff is Added Successfully' } });
        render(<AddUserForm />);

        const accountTypeElement = screen.getByText(/Account Type/i);
        const accountTypeText = accountTypeElement.textContent;
        expect(accountTypeText).toBe('Account Type');

        screen.findByText(/Add User/i)
        const selectElement = screen.getByRole('combobox', { id: /dropdown/i });
        fireEvent.change(selectElement, { target: { value: '2' } });
        fireEvent.click(screen.getByRole('button', { name: /Add User/i }));
        expect(addUserAccount).toHaveBeenCalledWith(expect.objectContaining({
            username: expect.any(String),
            email: expect.any(String),
            password: expect.any(String),
            confirm_password: expect.any(String),
            user_type: '2',
        }));
        await waitFor(() => {
            screen.findByText(/New Staff is Added Successfully/i)
        });
    })

    test('Password mismatch', async () => {
        addUserAccount.mockResolvedValue({ data: { message: 'Password does not match' } });
        render(<AddUserForm />);

        const accountTypeElement = screen.getByText(/Account Type/i);
        const accountTypeText = accountTypeElement.textContent;
        expect(accountTypeText).toBe('Account Type');

        screen.findByText(/Add User/i)
        const selectElement = screen.getByRole('combobox', { id: /dropdown/i });
        fireEvent.change(selectElement, { target: { value: '2' } });
        fireEvent.click(screen.getByRole('button', { name: /Add User/i }));
        expect(addUserAccount).toHaveBeenCalledWith(expect.objectContaining({
            username: expect.any(String),
            email: expect.any(String),
            password: expect.any(String),
            confirm_password: expect.any(String),
            user_type: '2',
        }));
        await waitFor(() => {
            screen.findByText(/Password does not match/i)
        });
    })

    test('Username already in use', async () => {
        addUserAccount.mockResolvedValue({ data: { message: 'Username already in use' } });
        render(<AddUserForm />);

        const accountTypeElement = screen.getByText(/Account Type/i);
        const accountTypeText = accountTypeElement.textContent;
        expect(accountTypeText).toBe('Account Type');

        screen.findByText(/Add User/i)
        const selectElement = screen.getByRole('combobox', { id: /dropdown/i });
        fireEvent.change(selectElement, { target: { value: '2' } });
        fireEvent.click(screen.getByRole('button', { name: /Add User/i }));
        expect(addUserAccount).toHaveBeenCalledWith(expect.objectContaining({
            username: expect.any(String),
            email: expect.any(String),
            password: expect.any(String),
            confirm_password: expect.any(String),
            user_type: '2',
        }));
        await waitFor(() => {
            screen.findByText(/Username already in use/i)
        });
    })

    test('Email already in use', async () => {
        addUserAccount.mockResolvedValue({ data: { message: 'Email already in use' } });
        render(<AddUserForm />);

        const accountTypeElement = screen.getByText(/Account Type/i);
        const accountTypeText = accountTypeElement.textContent;
        expect(accountTypeText).toBe('Account Type');

        screen.findByText(/Add User/i)
        const selectElement = screen.getByRole('combobox', { id: /dropdown/i });
        fireEvent.change(selectElement, { target: { value: '2' } });
        fireEvent.click(screen.getByRole('button', { name: /Add User/i }));
        expect(addUserAccount).toHaveBeenCalledWith(expect.objectContaining({
            username: expect.any(String),
            email: expect.any(String),
            password: expect.any(String),
            confirm_password: expect.any(String),
            user_type: '2',
        }));
        await waitFor(() => {
            screen.findByText(/Email already in use/i)
        });
    })
    test('updates state on user name input change', async () => {
        render(<AddUserForm />);


        const userNameInput = document.querySelector('[data-testid="username-input"]');

        userNameInput.value = 'newUser';
        userNameInput.dispatchEvent(new Event('input', { bubbles: true }));
        expect(userNameInput.value).toBe('newUser');
        fireEvent.change(userNameInput, { target: { value: 'newPassword' } });
        expect(userNameInput.value).toBe('newPassword');

    });

    test('updates state on email input change', async () => {
        render(<AddUserForm />);
        const emailInput = document.querySelector('[data-testid="email-input"]');
        emailInput.value = 'newUser@gmail.com';
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
        expect(emailInput.value).toBe('newUser@gmail.com');
        fireEvent.change(emailInput, { target: { value: 'newPassword' } });
        expect(emailInput.value).toBe('newPassword');
    });

    test('updates state on password input change', async () => {
        render(<AddUserForm />);
        const passwordInput = document.querySelector('[data-testid="password-input"]');
        passwordInput.value = 'newUserpassword';
        passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
        expect(passwordInput.value).toBe('newUserpassword');
        fireEvent.change(passwordInput, { target: { value: 'newPassword' } });
        expect(passwordInput.value).toBe('newPassword');
    });

    test('update state on confirm password input change',async ()=>{
        render(<AddUserForm/>);
        const confirmpasswordInput=document.querySelector('[data-testid="confirmpassword-input"]')
        confirmpasswordInput.value='newUserpassword';
        confirmpasswordInput.dispatchEvent(new Event('input',{bubbles:true}))
        expect(confirmpasswordInput.value).toBe('newUserpassword')
        fireEvent.change(confirmpasswordInput, { target: { value: 'newPassword' } });
        expect(confirmpasswordInput.value).toBe('newPassword');
    })

    test('update state on account type input change',async ()=>{
        render(<AddUserForm/>);
        const accountTypeInput=document.querySelector('[data-testid="select-input"]')
        accountTypeInput.value='1';
        accountTypeInput.dispatchEvent(new Event('input',{bubbles:true}))
        expect(accountTypeInput.value).toBe('1')
        fireEvent.change(accountTypeInput, { target: { value: '2' } });
        expect(accountTypeInput.value).toBe('2');
    })
    test('handles password toggle button click', () => {
        render(<AddUserForm />);
      
        const passwordToggleBtn = document.querySelector('[data-testid="show-password"]')
        fireEvent.click(passwordToggleBtn);
        const passwordToggleBtn2 = document.querySelector('[data-testid="show-password2"]')
        fireEvent.click(passwordToggleBtn2);

})
});
