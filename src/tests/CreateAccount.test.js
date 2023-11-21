import React from 'react';
import { render, fireEvent, screen, act,waitFor } from '@testing-library/react';
import { createAccount } from '../services/ApiServices';
import { useNavigate } from 'react-router-dom';
import CreateAccount from '../components/createaccount/CreateAccount';
import { useAuth } from '../contexts/AuthContext';
import { AuthProvider } from '../contexts/AuthContext';
import 'jest-localstorage-mock';
import '@testing-library/jest-dom'
import 'jest-localstorage-mock';
import { jwtDecode } from "jwt-decode";
import userEvent from "@testing-library/user-event";


jest.mock("jwt-decode");
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


const renderWithProvider = (component) => {
    return render(<AuthProvider>{component}</AuthProvider>);
};


describe('CreateAccount Component', () => {

    beforeEach(() => {

        jest.clearAllMocks();    
    });

    test("handles account creation and sets tokens in localStorage", async () => {
      createAccount.mockResolvedValue({
        data: {
          message: "Account Created Successfully",
          access_token: "mockAccessToken",
          refresh_token: "mockRefreshToken",
        },
      });

      jwtDecode.mockReturnValue({ account_number: "mockAccountNumber" });
      jest.spyOn(Storage.prototype, "setItem");
      render(<CreateAccount />);
      userEvent.type(screen.getByTestId("account-input"), "TestAccount");
      fireEvent.click(screen.getByText("Go to My Account"));
      await act(async () => {  
        screen.findByText(/Account Created Successfully/i);
      }); 
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

    test('Create Account successfully', async () => {
      const errorMessage = 'User Registration failed:Error in Creating Account'
      const alertSpy = jest.spyOn(window, 'alert');
      const mockNavigate = jest.fn();
      useNavigate.mockReturnValue(mockNavigate);
      
      createAccount.mockRejectedValueOnce('Error in Creating Account');
      renderWithProvider(<CreateAccount />);
      const accountNameElement = screen.getByText('Account Name');
      expect(accountNameElement).toBeInTheDocument();
      fireEvent.click(screen.getByText(/Go to My Account/i));
      await waitFor(()=>{
        expect(alertSpy).toHaveBeenCalled();
    })
     
     
  });

    test('renders CreateAccount component', () => {
      const mockNavigate = jest.fn();
      useNavigate.mockReturnValue(mockNavigate);
    
      render(<CreateAccount />);
    
      const titleElement = screen.getByText('Create Account');
      const accountNameLabel = screen.getByText('Account Name');
      const submitButton = screen.getByText('Go to My Account');
    
      expect(titleElement).toBeInTheDocument();
      expect(accountNameLabel).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
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
    test('handles create account generic error', async () => {
      const errorMessage = 'Failed to create account';
      createAccount.mockRejectedValueOnce(errorMessage);
    
      render(<CreateAccount />);
    
      const accountName=document.querySelector('[data-testid="account-input"]')
        fireEvent.change(accountName, { target: { value: 'accountname' } });
    
      const submitButton = screen.getByText('Go to My Account');
      fireEvent.click(submitButton);
    
      await waitFor(() => {
        expect(screen.findByText(errorMessage));
      });
    
      expect(createAccount).toHaveBeenCalledWith({
        account_name: 'accountname',
      });
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

      test('does not navigate on account creation failure', async () => {
        const mockNavigate = jest.fn();
        useNavigate.mockReturnValue(mockNavigate);
      
        const errorMessage = 'Failed to create account';
        createAccount.mockRejectedValueOnce(errorMessage);
      
        render(<CreateAccount />);
      
        const accountNameInput = screen.getByTestId('account-input');
        fireEvent.change(accountNameInput, { target: { value: 'NewAccount' } });
      
        const submitButton = screen.getByText('Go to My Account');
        fireEvent.click(submitButton);
      
        await waitFor(() => {
          expect(mockNavigate).not.toHaveBeenCalled();
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
