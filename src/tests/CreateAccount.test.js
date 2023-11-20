import React from 'react';
import { render, fireEvent, screen, act,waitFor } from '@testing-library/react';
import { createAccount } from '../services/ApiServices';
import { useNavigate } from 'react-router-dom';
import CreateAccount from '../components/createaccount/CreateAccount';
import { useAuth } from '../contexts/AuthContext';
import { AuthProvider } from '../contexts/AuthContext';
import 'jest-localstorage-mock';
import '@testing-library/jest-dom'



jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));

jest.mock('../services/ApiServices', () => ({
    ...jest.requireActual('../services/ApiServices'),
    createAccount: jest.fn()
}))
jest.mock('../contexts/AuthContext', () => ({
    ...jest.requireActual('../contexts/AuthContext'),
    useAuth: jest.fn()
}));

jest.mock('../contexts/AuthContext', () => ({
    ...jest.requireActual('../contexts/AuthContext'),
    useAuth: () => ({
        setAccountNames: jest.fn(),
        
    })
}));


const setAccountNames = jest.fn();

const renderWithProvider = (component) => {
    return render(<AuthProvider>{component}</AuthProvider>);
};


describe('CreateAccount Component', () => {

    beforeEach(() => {

        jest.clearAllMocks();
        
    });
    test('Create Account successfully', async () => {

        const mockNavigate = jest.fn();
        useNavigate.mockReturnValue(mockNavigate);
        
        createAccount.mockResolvedValue({
            data: {
                message: 'Account Created Successfully',
                account_number: 1234567890,
                access_token: "access_token",
                refresh_token: "refresh_token"
            },
        });


        renderWithProvider(<CreateAccount />);
        const accountNameElement = screen.getByText('Account Name');
        expect(accountNameElement).toBeInTheDocument();
        fireEvent.click(screen.getByText(/Go to My Account/i));
        await act(async () => {
           
            screen.findByText(/Account Created Successfully/i);
          });
       
       
    });

    test('Only customers can create accounts', async () => {

        const mockNavigate = jest.fn();
        useNavigate.mockReturnValue(mockNavigate);
        
        createAccount.mockResolvedValue({
            data: {
                message: 'Only customers can create accounts',
                account_number: 1234567890,
                access_token: "access_token",
                refresh_token: "refresh_token"
            },
        });


        renderWithProvider(<CreateAccount />);

        const accountNameElement = screen.getByText('Account Name');
        expect(accountNameElement).toBeInTheDocument();
        fireEvent.click(screen.getByText(/Go to My Account/i));
        await screen.findByText(/Only customers can create accounts/i); 
       
    });
    test('An account with this name already exists', async () => {

        const mockNavigate = jest.fn();
        useNavigate.mockReturnValue(mockNavigate);
        
        createAccount.mockResolvedValue({
            data: {
                message: 'An account with this name already exists',
                account_number: 1234567890,
                access_token: "access_token",
                refresh_token: "refresh_token"
            },
        });


        renderWithProvider(<CreateAccount />);

        const accountNameElement = screen.getByText('Account Name');
        expect(accountNameElement).toBeInTheDocument();
        fireEvent.click(screen.getByText(/Go to My Account/i));
        await screen.findByText(/An account with this name already exists/i);
       
       
    });
    test('Account Name is required', async () => {

        const mockNavigate = jest.fn();
        useNavigate.mockReturnValue(mockNavigate);
        
        createAccount.mockResolvedValue({
            data: {
                message: 'Account Name is required',
                account_number: 1234567890,
                access_token: "access_token",
                refresh_token: "refresh_token"
            },
        });
        renderWithProvider(<CreateAccount />);
        const accountNameElement = screen.getByText('Account Name');
        expect(accountNameElement).toBeInTheDocument();
        fireEvent.click(screen.getByText(/Go to My Account/i));
        await screen.findByText(/Account Name is required/i);
       
    });

    test('Account Name', async () => {

        renderWithProvider(<CreateAccount />);
        const accountName=document.querySelector('[data-testid="account-input"]')
        fireEvent.change(accountName, { target: { value: 'accountname' } });
        expect(accountName.value).toBe('accountname');
       
    });

    test('handles localStorage updates', async () => {
       
        const mockCreateAccountResponse = {
          data: {
            message: 'Account Created Successfully',
            access_token: 'mockAccessToken',
            refresh_token: 'mockRefreshToken',
          },
        };
        createAccount.mockResolvedValueOnce(mockCreateAccountResponse);
    
        render(<CreateAccount />);
    
        const accountNameInput = screen.getByTestId('account-input');
        fireEvent.change(accountNameInput, { target: { value: 'TestAccount' } });
    
        const createAccountButton = screen.getByText('Go to My Account');
        fireEvent.click(createAccountButton);
    
        await waitFor(() => {
          expect(createAccount).toHaveBeenCalledWith({
            account_name: 'TestAccount',
          });
        });
    
      });

      test('handles create account error', async () => {
        const errorMessage = 'Account creation failed';
        createAccount.mockRejectedValueOnce((errorMessage));
    
        render(<CreateAccount />);
    
        const accountNameInput = screen.getByTestId('account-input');
        fireEvent.change(accountNameInput, { target: { value: 'NewAccount' } });
    
        const submitButton = screen.getByText('Go to My Account');
        fireEvent.click(submitButton);
    
        await waitFor(() => {
          expect(screen.findByText(errorMessage))
        });
    
        expect(createAccount).toHaveBeenCalledWith({
          account_name: 'NewAccount',
        });
      });


test('handles create account error', async () => {
    const errorMessage = 'Account creation failed';
    createAccount.mockRejectedValueOnce({ message: errorMessage });
  
    render(<CreateAccount />);
  
    const accountNameInput = screen.getByTestId('account-input');
    fireEvent.change(accountNameInput, { target: { value: 'NewAccount' } });
  
    const submitButton = screen.getByText('Go to My Account');
    fireEvent.click(submitButton);
  
    await waitFor(() => {
      expect(screen.findByText(errorMessage));
    });
  
    expect(createAccount).toHaveBeenCalledWith({
      account_name: 'NewAccount',
    });
  });
  
    })
