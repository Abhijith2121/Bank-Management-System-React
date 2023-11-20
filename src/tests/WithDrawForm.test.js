import React from 'react';
import { render, fireEvent, screen, act,waitFor } from '@testing-library/react';
import WithdrawForm from '../components/withdrawform/WithdrawForm'
import { withdraw } from '../services/ApiServices';
import '@testing-library/jest-dom'

jest.mock('../services/ApiServices', () => ({
    ...jest.requireActual('../services/ApiServices'),
    withdraw: jest.fn()
}))


describe('WithdrawForm Component',()=>{

    test('renders withdraw form', () => {
        render(<WithdrawForm />);
    });

    test('Deposit successful',async()=>{
       withdraw.mockResolvedValue({ status: 200, data: { message: 'Withdraw Successfully' } });
       render(<WithdrawForm/>)

       fireEvent.change(screen.getByPlaceholderText(/Amount/i),{target:{value:'100'}})
       fireEvent.click(screen.getByText(/Withdraw/i))
       expect(withdraw).toHaveBeenCalledWith(expect.objectContaining({
        account_number: expect.any(String),
        amount: '100',
      }));
      
       await act(async () => {
         screen.findByText(/Withdraw Successfully/i)
      });
     
    });
    test('Account is not active',async()=>{
        withdraw.mockResolvedValue({ status: 200, data: { message: 'Account is pending approval' } });
        render(<WithdrawForm/>)
 
        fireEvent.change(screen.getByPlaceholderText(/Amount/i),{target:{value:'100'}})
        fireEvent.click(screen.getByText(/Withdraw/i))
        expect(withdraw).toHaveBeenCalledWith(expect.objectContaining({
         account_number: expect.any(String),
         amount: '100',
       }));
       
        await act(async () => {
          screen.findByText(/Account is pending approval/i)
       });
      
     });

     test('withdraw amount lesser than zero',async()=>{
        withdraw.mockResolvedValue({ status: 200, data: { message: 'Withdrawal amount should not be lesser than zero' } });
        render(<WithdrawForm/>)
 
        fireEvent.change(screen.getByPlaceholderText(/Amount/i),{target:{value:'-5'}})
        fireEvent.click(screen.getByText(/Withdraw/i))
        expect(withdraw).toHaveBeenCalledWith(expect.objectContaining({
         account_number: expect.any(String),
         amount: '-5',
       }));
       
        await act(async () => {
          screen.findByText(/Withdrawal amount should not be lesser than zero/i)
       });
     });

     test('Insufficient balance',async()=>{
        withdraw.mockResolvedValue({ status: 200, data: { message: 'Insufficient balance' } });
        render(<WithdrawForm/>)
        fireEvent.change(screen.getByPlaceholderText(/Amount/i),{target:{value:'500'}})
        fireEvent.click(screen.getByText(/Withdraw/i))
        expect(withdraw).toHaveBeenCalledWith(expect.objectContaining({
         account_number: expect.any(String),
         amount: '500',
       }));
        await act(async () => {
          screen.findByText(/Insufficient balance/i)
       });
      
     });
     test('handles missing amount', async () => {
      render(<WithdrawForm />);
      
      fireEvent.click(screen.getByText(/Withdraw/i));
  
      await act(async () => {
          screen.findByText(/Amount is required/i);
      });   
    })
    test('handles withdraw error', async () => {
      const errorMessage = 'withdraw failed';
      withdraw.mockRejectedValueOnce((errorMessage));
    
      render(<WithdrawForm />);
    
      fireEvent.change(screen.getByPlaceholderText(/Amount/i), { target: { value: '100' } });
    
      const withdrawButton = screen.getByText('Withdraw');
      fireEvent.click(withdrawButton);
    
      await waitFor(() => {
        expect(screen.findByText(errorMessage))
      });
    
      expect(withdraw).toHaveBeenCalledWith({
        account_number: expect.any(String),
        amount: '100',
      });
    });
  })

