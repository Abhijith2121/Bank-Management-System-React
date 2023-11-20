import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import AccountLogin from '../components/accountlogin/AccountLogin';
import { useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';

import { accountLogin } from '../services/ApiServices';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../services/ApiServices', () => ({
  ...jest.requireActual('../services/ApiServices'),
  accountLogin: jest.fn()
}));

describe('AccountLogin Component', () => {
  test('Account Login successfully', async () => {
    const navigateMock = jest.fn();
    useNavigate.mockImplementation(navigateMock);

    accountLogin.mockResolvedValue({
      data: {
        message: 'Account Login Successful',
        account_number: 1234567890,
        account_name: 'Test Account',
        access_token: 'mockAccessToken',
        refresh_token: 'mockRefreshToken',
      },
    });

    render(<AccountLogin />);
    fireEvent.change(screen.getByPlaceholderText(/Account Number/i), { target: { value: '1234567890' } });
    fireEvent.click(screen.getByText(/Go to My Account/i))
    
    await waitFor(() => {
      screen.findByText(/Account Login Successful/i)
    });
  });
  test('Account Number is required', async () => {
    const navigateMock = jest.fn();
    useNavigate.mockImplementation(navigateMock);

    accountLogin.mockResolvedValue({
      data: {
        message: 'Account Number is required',
        
      },
    });

    render(<AccountLogin />);
    fireEvent.click(screen.getByText(/Go to My Account/i))
    
    await waitFor(() => {
      screen.findByText(/Account Number is required/i)
    });
  });

  test('Account not found', async () => {
    const navigateMock = jest.fn();
    useNavigate.mockImplementation(navigateMock);

    accountLogin.mockResolvedValue({
      data: {
        message: 'Account not found',
        
      },
    });

    render(<AccountLogin />);
    fireEvent.change(screen.getByPlaceholderText(/Account Number/i), { target: { value: '1234567890' } });
    fireEvent.click(screen.getByText(/Go to My Account/i))
    
    await waitFor(() => {
      screen.findByText(/Account not found/i)
    });
  });
  test('Invalid Account Number', async () => {
    const navigateMock = jest.fn();
    useNavigate.mockImplementation(navigateMock);

    accountLogin.mockResolvedValue({
      data: {
        message: 'Invalid Account Number',
        
      },
    });

    render(<AccountLogin />);
    fireEvent.change(screen.getByPlaceholderText(/Account Number/i), { target: { value: '1234567890' } });
    fireEvent.click(screen.getByText(/Go to My Account/i))
    
    await waitFor(() => {
      screen.findByText(/Invalid Account Number/i)
    });
  });

  test('Unauthorized access', async () => {
    const navigateMock = jest.fn();
    useNavigate.mockImplementation(navigateMock);

    accountLogin.mockResolvedValue({
      data: {
        message: 'Unauthorized access',
        
      },
    });

    render(<AccountLogin />);
    fireEvent.change(screen.getByPlaceholderText(/Account Number/i), { target: { value: '1234567890' } });
    fireEvent.click(screen.getByText(/Go to My Account/i))
    
    await waitFor(() => {
      screen.findByText(/Unauthorized access/i)
    });
  });
});
