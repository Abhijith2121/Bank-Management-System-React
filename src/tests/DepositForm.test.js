import React from 'react';
import { render, fireEvent, screen, act, waitFor } from '@testing-library/react';
import DepositForm from '../components/depositform/DepositForm';
import { deposit } from '../services/ApiServices';
import '@testing-library/jest-dom'



jest.mock('../services/ApiServices', () => ({
  ...jest.requireActual('../services/ApiServices'),
  deposit: jest.fn()
}))


describe('DepositForm Component', () => {


  test('renders deposit form', () => {
    render(<DepositForm />);
  });

  test('Deposit successful', async () => {
    deposit.mockResolvedValue({ status: 200, data: { message: 'Deposit Successfully' } });
    render(<DepositForm />)

    fireEvent.change(screen.getByPlaceholderText(/Amount/i), { target: { value: '100' } })
    fireEvent.click(screen.getByText(/Deposit/i))
    expect(deposit).toHaveBeenCalledWith(expect.objectContaining({
      account_number: expect.any(String),
      amount: '100',
    }));

    await act(async () => {
      screen.findByText(/Amount Deposited/i)
    });

  });
  test('Account is not active', async () => {
    deposit.mockResolvedValue({ status: 200, data: { message: 'Account is pending approval' } });
    render(<DepositForm />)

    fireEvent.change(screen.getByPlaceholderText(/Amount/i), { target: { value: '100' } })
    fireEvent.click(screen.getByText(/Deposit/i))
    expect(deposit).toHaveBeenCalledWith(expect.objectContaining({
      account_number: expect.any(String),
      amount: '100',
    }));

    await act(async () => {
      screen.findByText(/Account is pending approval/i)
    });

  });

  test('Amount less than zero', async () => {
    deposit.mockResolvedValue({ status: 200, data: { message: 'Deposit amount should  be more than zero' } });
    render(<DepositForm />)

    fireEvent.change(screen.getByPlaceholderText(/Amount/i), { target: { value: '-5' } })
    fireEvent.click(screen.getByText(/Deposit/i))
    expect(deposit).toHaveBeenCalledWith(expect.objectContaining({
      account_number: expect.any(String),
      amount: '-5',
    }));

    await act(async () => {
      screen.findByText(/Deposit amount should  be more than zero/i)
    });

  });
  test('handles deposit with no amount provided', async () => {
    render(<DepositForm />);

    fireEvent.click(screen.getByText(/Deposit/i))
    await waitFor(() => {
      expect(screen.findByText('Amount is required.'))

    });
    expect(deposit).toHaveBeenCalled();

  });
  test('handles deposit with non-numeric amount', async () => {
    render(<DepositForm />);

    fireEvent.change(screen.getByPlaceholderText(/Amount/i), { target: { value: 'abc' } });
    const depositButton = screen.getByText('Deposit');
    fireEvent.click(depositButton);

    await waitFor(() => {
      expect(screen.findByText('Amount must be a valid number.'))
    });

    expect(deposit).toHaveBeenCalled();
  });

  

  test('handles deposit error', async () => {
    const errorMessage = 'Deposit failed';
    deposit.mockRejectedValueOnce((errorMessage));

    render(<DepositForm />);

    fireEvent.change(screen.getByPlaceholderText(/Amount/i), { target: { value: '100' } });

    const depositButton = screen.getByText('Deposit');
    fireEvent.click(depositButton);

    await waitFor(() => {
      expect(screen.findByText(errorMessage))
    });

    expect(deposit).toHaveBeenCalledWith({
      account_number: expect.any(String),
      amount: '100',
    });
  });
})


