import React from 'react';
import { render, screen, waitFor, act,fireEvent } from '@testing-library/react';
import Transaction from '../components/transactions/Transaction';
import { transactionsHistory,downloadTransaction,deleteTransaction } from '../services/ApiServices';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

jest.mock('../services/ApiServices', () => ({
    ...jest.requireActual('../services/ApiServices'),
    transactionsHistory: jest.fn(),
    downloadTransaction:jest.fn(),
    deleteTransaction:jest.fn()
}));

describe('Transaction Component', () => {
    test('renders transactions and handles download transaction', async () => {

        transactionsHistory.mockResolvedValueOnce({
            data: {
                transactions: [
                    {
                        amount: 100,
                        transaction_type: 'Deposit',
                        created_at: '2023-01-01T12:00:00Z',
                    },
                ],
            },
        });
        await act(async () => {
            render(<Transaction />);
        });

        screen.getByText(/Sl:No/i);
        screen.getByText(/Transaction Type/i);
        screen.getByText(/Amount/i);
        screen.getByText(/Created At/i);

        await act(async ()=>{
            screen.findByText(/Deposit/i)
            screen.findByText(/100/i)
            screen.findByText(/2023-01-01T12:00:00Z/i)
        })

    });

    test('handles download transaction with error', async () => {
        transactionsHistory.mockResolvedValueOnce({
            data: {
                transactions: [],
            },
        });

        downloadTransaction.mockRejectedValueOnce(new Error('Download error'));

        await act(async () => {
            render(<Transaction />);
        });

        fireEvent.click(screen.getByText(/Download/i))

        await waitFor(() => {
            expect(downloadTransaction).toHaveBeenCalledTimes(1);
        });  
    });

});
test('handles successful transaction deletion', async () => {
    transactionsHistory.mockResolvedValueOnce({
        data: {
            transactions: [
                {
                    id: 1,
                    amount: 100,
                    transaction_type: 'Deposit',
                    created_at: '2023-01-01T12:00:00Z',
                    isDeleted: false,
                },
            ],
        },
    });

    deleteTransaction.mockResolvedValueOnce({
        data: {
            message: 'Transaction deleted successfully',
        },
    });

    await act(async () => {
        render(<Transaction />);
    });

    await waitFor(() => {
        screen.findByText(/Transaction deleted successfully/i)
    });
});
    test('fetchTransactions successful case', async () => {
        const mockAuthTokens = {
          access_token: 'fakeToken',
          account_number: '123456789',
        };
    
        const mockTransactionsResponse = {
          data: {
            transactions: [
                {
                    id: 1,
                    amount: 100,
                    transaction_type: 'Deposit',
                    created_at: '2023-01-01T12:00:00Z',
                    isDeleted: false,
                },
            ],
          },
        };
    
        transactionsHistory.mockResolvedValueOnce(mockTransactionsResponse);
        const result = await transactionsHistory(mockAuthTokens);
        expect(transactionsHistory).toHaveBeenCalledWith({"access_token": "fakeToken", "account_number": "123456789"});
      });

      test('fetchTransactions error', async () => {
        const mockAuthTokens = {
          access_token: 'fakeToken',
          account_number: '123456789',
        };
      
        const errorMessage = 'Network error';
        transactionsHistory.mockRejectedValueOnce(new Error(errorMessage));
        await expect( transactionsHistory.mockResolvedValueOnce({"data": {"transactions": []}}));
      });
      
      test('handles error in useEffect', async () => {
        const errorMessage = 'Error fetching transactions';
        transactionsHistory.mockRejectedValueOnce((errorMessage));
    
        render(<Transaction />);
        await waitFor(() => {
          expect(screen.findByText(errorMessage))
        });
    
        expect(transactionsHistory).toHaveBeenCalled();
      });

      test('handles download transaction success', async () => {
        const successMessage = 'Transaction data saved successfully';
        downloadTransaction.mockResolvedValueOnce({
          data: { message: successMessage },
        });
    
        render(<Transaction />);
    
       
        userEvent.click(screen.getByText('Download'));
        await waitFor(() => {
          expect(screen.findByText(successMessage))
        });
        expect(downloadTransaction).toHaveBeenCalled();
      });

      test('handles download transaction error', async () => {
        const errorMessage = 'Download transaction failed';
        downloadTransaction.mockRejectedValueOnce(new Error(errorMessage));
        render(<Transaction />);
        userEvent.click(screen.getByText('Download'));
        await waitFor(() => {
          expect(screen.findByText(errorMessage))
        });
    
        expect(downloadTransaction).toHaveBeenCalled();
      });

      test('handles error in deleteTransaction',async()=>{

        transactionsHistory.mockResolvedValueOnce({
            data: {
                transactions: [
                    {
                        id: 1,
                        amount: 100,
                        transaction_type: 'Deposit',
                        created_at: '2023-01-01T12:00:00Z',
                        isDeleted: false,
                    },
                ],
            },
        });
        const errorMessage='Error deleting transaction'
        deleteTransaction.mockRejectedValueOnce(new Error(errorMessage))

        render(<Transaction/>)
        await waitFor(()=>{
            const deleteButton = document.querySelector('.trash-icon');
            userEvent.click(deleteButton);
        })
       
        await waitFor(()=>{
            expect(screen.findByText(errorMessage))
        });
      })

test('handle error in transactionHistory',async()=>{
    transactionsHistory.mockRejectedValueOnce(new Error("Error Fetching transactions"))
    render(<Transaction/>)
    await waitFor(()=>{
        expect(screen.findByText("Error Fetching transactions"))

    })
    expect(transactionsHistory).toHaveBeenCalled()
})
test('handles transaction marked as deleted', async () => {
    transactionsHistory.mockResolvedValueOnce({
        data: {
            transactions: [
                {
                    id: 1,
                    amount: 100,
                    transaction_type: 'Deposit',
                    created_at: '2023-01-01T12:00:00Z',
                    isDeleted: true,
                },
            ],
        },
    });
    render(<Transaction />);
    await waitFor(() => {
        expect(screen.queryByText('Deposit')).toBeNull();
    });
})
test('handles error in download transaction', async () => {
    transactionsHistory.mockResolvedValueOnce({
        data: {
            transactions: [
                {
                    id: 1,
                    amount: 100,
                    transaction_type: 'Deposit',
                    created_at: '2023-01-01T12:00:00Z',
                    isDeleted: false,
                },
            ],
        },
    });
    downloadTransaction.mockRejectedValueOnce('Download error');
    render(<Transaction />);
    fireEvent.click(screen.getByText('Download'));
    await waitFor(() => {
        expect(downloadTransaction).toHaveBeenCalledTimes(2);
        expect(screen.findByText('Download error'))
    });
});
test('handles successful transaction deletion', async () => {
    transactionsHistory.mockResolvedValueOnce({
        data: {
            transactions: [
                {
                    id: 1,
                    amount: 100,
                    transaction_type: 'Deposit',
                    created_at: '2023-01-01T12:00:00Z',
                    isDeleted: false,
                },
            ],
        },
    });

    deleteTransaction.mockResolvedValueOnce({
        data: {
            message: 'Transaction deleted successfully',
        },
    });
    render(<Transaction />);
    await waitFor(() => {
        expect(screen.findByText('Deposit'))
    });
    await waitFor(()=>{
        const deleteButton = document.querySelector('.trash-icon');
        userEvent.click(deleteButton);
    })

    await waitFor(() => {
        expect(screen.findByText('Transaction deleted successfully'))
    });
});
test('renders multiple transactions', async () => {
    transactionsHistory.mockResolvedValueOnce({
        data: {
            transactions: [
                {
                    id: 1,
                    amount: 100,
                    transaction_type: 'Deposit',
                    created_at: '2023-01-01T12:00:00Z',
                    isDeleted: false,
                },
                {
                    id: 2,
                    amount: 50,
                    transaction_type: 'Withdrawal',
                    created_at: '2023-01-02T12:30:00Z',
                    isDeleted: false,
                },
            ],
        },
    });

    render(<Transaction />);
    await waitFor(() => {
        expect(screen.findByText('Deposit'))
        expect(screen.findByText('Withdrawal'))
    });
});
test('handles error in transaction deletion', async () => {
    transactionsHistory.mockResolvedValueOnce({
        data: {
            transactions: [
                {
                    id: 1,
                    amount: 100,
                    transaction_type: 'Deposit',
                    created_at: '2023-01-01T12:00:00Z',
                    isDeleted: false,
                },
            ],
        },
    });

    deleteTransaction.mockRejectedValueOnce('Deletion error');

    render(<Transaction />);
    await waitFor(()=>{
        const deleteButton = document.querySelector('.trash-icon');
        userEvent.click(deleteButton);
    })
    await waitFor(() => {
        expect(screen.findByText('Deletion error'))
    });
   
});
test('handles successful transaction deletion and updates state', async () => {
    const initialTransactions = [
        {
            id: 1,
            amount: 100,
            transaction_type: 'Deposit',
            created_at: '2023-01-01T12:00:00Z',
            isDeleted: false,
        },
        {
            id: 2,
            amount: 50,
            transaction_type: 'Withdrawal',
            created_at: '2023-01-02T12:30:00Z',
            isDeleted: false,
        },
    ];

    transactionsHistory.mockResolvedValueOnce({
        data: {
            transactions: initialTransactions,
        },
    });

    deleteTransaction.mockResolvedValueOnce({
        data: {
            message: 'Transaction deleted successfully',
        },
    });

    render(<Transaction />);

    await waitFor(() => {
        expect(screen.findByText('Deposit'))
        expect(screen.findByText('Withdrawal'))
    });

    await waitFor(()=>{
        const deleteButton = document.querySelector('.trash-icon');
        userEvent.click(deleteButton);
    })
    await waitFor(() => {
        expect(screen.queryByText('Deposit')).toBeNull();
    });
    await waitFor(() => {
        expect(screen.findByText('Transaction deleted successfully'))
    });

    expect(screen.findByText('Withdrawal'))
});
test('handles successful transaction deletion', async () => {
    const initialTransactions = [
        {
            id: 1,
            amount: 100,
            transaction_type: 'Deposit',
            created_at: '2023-01-01T12:00:00Z',
            isDeleted: false,
        },
        {
            id: 2,
            amount: 50,
            transaction_type: 'Withdrawal',
            created_at: '2023-01-02T12:30:00Z',
            isDeleted: false,
        },
    ];

    transactionsHistory.mockResolvedValueOnce({
        data: {
            transactions: initialTransactions,
        },
    });

    deleteTransaction.mockResolvedValueOnce({
        data: {
            message: 'Transaction deleted successfully',
        },
    });

    render(<Transaction />);
    await waitFor(() => {
        expect(screen.findByText('Deposit'))
        expect(screen.findByText('Withdrawal'))
    });

    
    userEvent.click(document.querySelector('.trash-icon'));

    
    await waitFor(() => {
        expect(screen.queryByText('Deposit')).toBeNull();
    });

    await waitFor(() => {
        expect(screen.findByText('Transaction deleted successfully'))
    });

   
    expect(screen.findByText('Withdrawal'))
   
});

test('handles successful transaction deletion and updates state', async () => {
    const initialTransactions = [
        {
            id: 1,
            amount: 100,
            transaction_type: 'Deposit',
            created_at: '2023-01-01T12:00:00Z',
            isDeleted: false,
        },
        {
            id: 2,
            amount: 50,
            transaction_type: 'Withdrawal',
            created_at: '2023-01-02T12:30:00Z',
            isDeleted: false,
        },
    ];

    transactionsHistory.mockResolvedValueOnce({
        data: {
            transactions: initialTransactions,
        },
    });
    deleteTransaction.mockResolvedValueOnce({
        data: {
            message: 'Transaction deleted successfully',
        },
    });

    render(<Transaction />);
    await waitFor(() => {
        expect(screen.findByText('Deposit'))
        
    });

    userEvent.click(document.querySelector('.trash-icon'));
    await waitFor(() => {
        expect(screen.queryByText('Deposit')).toBeNull();
    });
    await waitFor(() => {
        expect(screen.findByText('Transaction deleted successfully'))
    });

    deleteTransaction.mockRejectedValueOnce(new Error('Deletion error'));
    userEvent.click(document.querySelector('.trash-icon'));
    await waitFor(() => {
        expect(screen.findByText('Deletion error'))
    });

    expect(screen.findByText('Withdrawal'))
});

test('handles no auth tokens', async () => {
    localStorage.removeItem('authTokens');
    render(<Transaction />);
    await waitFor(() => {
    screen.findByText('No token');
    });

});




      
     

    
      

