import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import StaffDashboard from '../components/staffcomponents/staffdashboard/StaffDashboard';
import { list,openAccount,closeAccount,pagination,searchbyName } from '../services/ApiServices';
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event';


jest.mock('../services/ApiServices', () => ({
  ...jest.requireActual('../services/ApiServices'),
  list: jest.fn(),
  openAccount:jest.fn(),
  closeAccount:jest.fn(),
  pagination:jest.fn(),
  searchbyName:jest.fn()
}));

describe('StaffDashboard Component', () => {
  test('renders accounts', async () => {
    const mockListResponse = {
      data: {
        results: [
          {
            id: 1,
            account_name: 'Test Account',
            account_number: '1234567890',
            status: 'pending',
            customer: {
              username: 'testuser',
            },
          },
        ],
        next: 'next_page_url',
        previous: 'prev_page_url',
      },
    };

    list.mockResolvedValueOnce(mockListResponse);
    render(<StaffDashboard />);

    await waitFor(() => {
      screen.findByText(/Test Account/i);
      screen.findByText(/1234567890/i);
      screen.findByText(/Pending/i);
      screen.findByText(/testuser/i);
    });
    expect(list).toHaveBeenCalledTimes(1);
  });

  test("open Account",async()=>{
    const mockListResponse = {
        data: {
          results: [
            {
              id: 1,
              account_name: 'Test Account',
              account_number: '1234567890',
              status: 'pending',
              customer: {
                username: 'testuser',
              },
            },
          ],
          next: 'next_page_url',
          previous: 'prev_page_url',
        },
      };
  
      list.mockResolvedValueOnce(mockListResponse);
      render(<StaffDashboard />);
  
      await waitFor(() => {
        screen.findByText(/Test Account/i);
        screen.findByText(/1234567890/i);
        screen.findByText(/Pending/i);
        screen.findByText(/testuser/i);
      });
    openAccount.mockResolvedValueOnce({
        data:{
            message:"Account is now active"
        }
    })

    fireEvent.click(screen.getByText("open")); 
    await waitFor(() => {
      screen.getByText(/Account is now active/i);
      screen.findByText(/active/i)
    });
  })

  test("open Account error",async()=>{
    const mockListResponse = {
        data: {
          results: [
            {
              id: 1,
              account_name: 'Test Account',
              account_number: '1234567890',
              status: 'pending',
              customer: {
                username: 'testuser',
              },
            },
          ],
          next: 'next_page_url',
          previous: 'prev_page_url',
        },
      };
  
      list.mockResolvedValueOnce(mockListResponse);
      render(<StaffDashboard />);
  
      await waitFor(() => {
        screen.findByText(/Test Account/i);
        screen.findByText(/1234567890/i);
        screen.findByText(/Pending/i);
        screen.findByText(/testuser/i);
      });
    openAccount.mockRejectedValue("Error in opening account")

    fireEvent.click(screen.getByText("open")); 
    await waitFor(() => {
      screen.getByText(/Error in opening account/i);
     
    });
  })
  test("close Account",async()=>{
    const mockListResponse = {
        data: {
          results: [
            {
              id: 1,
              account_name: 'Test Account',
              account_number: '1234567890',
              status: 'active',
              customer: {
                username: 'testuser',
              },
            },
          ],
          next: 'next_page_url',
          previous: 'prev_page_url',
        },
      };
  
      list.mockResolvedValueOnce(mockListResponse);
      render(<StaffDashboard />);
  
      await waitFor(() => {
        screen.findByText(/Test Account/i);
        screen.findByText(/1234567890/i);
        screen.findByText(/Pending/i);
        screen.findByText(/testuser/i);
      });
      closeAccount.mockResolvedValueOnce({
        data:{
            message:"Account is now in pending state"
        }
    })

    fireEvent.click(screen.getByText("close")); 
    await waitFor(() => {
      screen.getByText(/Account is now in pending state/i);
      screen.findByText(/pending/i)
    });
  })

  test("close Account error",async()=>{
    const mockListResponse = {
        data: {
          results: [
            {
              id: 1,
              account_name: 'Test Account',
              account_number: '1234567890',
              status: 'active',
              customer: {
                username: 'testuser',
              },
            },
          ],
          next: 'next_page_url',
          previous: 'prev_page_url',
        },
      };
  
      list.mockResolvedValueOnce(mockListResponse);
      render(<StaffDashboard />);
  
      await waitFor(() => {
        screen.findByText(/Test Account/i);
        screen.findByText(/1234567890/i);
        screen.findByText(/Pending/i);
        screen.findByText(/testuser/i);
      });
      closeAccount.mockRejectedValue("Error in closing account")

    fireEvent.click(screen.getByText("close")); 
    await waitFor(() => {
      screen.getByText(/Error in closing account/i);
    });
  })

  test('pagination',async()=>{
    const mockPaginationResponse = {
        data: {
          results: [],
          next: null,
          previous: null,
        },
      };
  
      pagination.mockResolvedValueOnce(mockPaginationResponse);
  
      await waitFor(() => {
        expect(screen.queryByText(/Test Account/i)).toBeNull();
        expect(screen.queryByText(/1234567890/i)).toBeNull();
        expect(screen.queryByText(/Pending/i)).toBeNull();
        expect(screen.queryByText(/testuser/i)).toBeNull();
      });
    });
    test('handles pagination', async () => {
      const mockListResponse = {
        data: {
          results: [
            {
              id: 1,
              account_name: 'Test Account',
              account_number: '1234567890',
              status: 'pending',
              customer: {
                username: 'testuser',
              },
            },
          ],
          next: 'next_page_url',
          previous: 'prev_page_url',
        },
      };
  
      const mockPaginationResponse = {
        data: {
          results: [
            {
              id: 2,
              account_name: 'Another Account',
              account_number: '9876543210',
              status: 'active',
              customer: {
                username: 'anotheruser',
              },
            },
          ],
          next: null,
          previous: 'prev_page_url',
        },
      };
  
      list.mockResolvedValueOnce(mockListResponse);
      pagination.mockResolvedValueOnce(mockPaginationResponse);
  
      render(<StaffDashboard />);
  
      await waitFor(() => {
        screen.findByText(/Test Account/i);
        screen.findByText(/1234567890/i);
        screen.findByText(/Pending/i);
        screen.findByText(/testuser/i);
      });
  
      fireEvent.click(screen.getByText('Next'));
  
      await waitFor(() => {
        screen.findByText(/Another Account/i);
        screen.findByText(/9876543210/i);
        screen.findByText(/Active/i);
        screen.findByText(/anotheruser/i);
      });
      expect(pagination).toHaveBeenCalledWith('next_page_url');
    });

    test(' handles sort order change', async () => {
      const mockListResponse = {
        data: {
          results: [
            {
              id: 1,
              account_name: 'Test Account 1',
              account_number: '1234567890',
              status: 'pending',
              customer: {
                username: 'testuser1',
              },
            },
            {
              id: 2,
              account_name: 'Test Account 2',
              account_number: '0987654321',
              status: 'active',
              customer: {
                username: 'testuser2',
              },
            },
          ],
          next: 'next_page_url',
          previous: 'prev_page_url',
        },
      };
  
      list.mockResolvedValueOnce(mockListResponse);
      render(<StaffDashboard />);
  
      await waitFor(() => {
        screen.getByText(/Test Account 1/i);
        screen.getByText(/Test Account 2/i);
      });
  
      fireEvent.click(screen.getByText(/Filter/i));
  
      await waitFor(() => {
        screen.getByText(/Test Account 2/i);
        screen.getByText(/Test Account 1/i);
      });
    });
    test('handles search API call', async () => {
      const mockSearchResponse = {
        data: {
          results: [
            {
              id: 1,
              account_name: 'Test Account',
              account_number: '1234567890',
              status: 'active',
              customer: {
                username: 'testuser',
              },
            },
          ],
        },
      };
  
      searchbyName.mockResolvedValueOnce(mockSearchResponse);
      render(<StaffDashboard />);
      fireEvent.change(screen.getByPlaceholderText(/Search.../i), { target: { value: 'test' } });
    });


    test("open Account error",async()=>{
      const errorMessage = 'Updation failed';
      const mockListResponse = {
          data: {
            results: [
              {
                id: 1,
                account_name: 'Test Account',
                account_number: '1234567890',
                status: 'pending',
                customer: {
                  username: 'testuser',
                },
              },
            ],
            next: 'next_page_url',
            previous: 'prev_page_url',
          },
        };
    
        list.mockResolvedValueOnce(mockListResponse);
        render(<StaffDashboard />);
    
        await waitFor(() => {
          screen.findByText(/Test Account/i);
          screen.findByText(/1234567890/i);
          screen.findByText(/Pending/i);
          screen.findByText(/testuser/i);
        });
      openAccount.mockRejectedValueOnce((errorMessage))
      
  
      fireEvent.click(screen.getByText("open")); 
      await waitFor(() => {
        screen.findByText(errorMessage)
      });
    })
    test("close Account error",async()=>{
      const errorMessage = 'Updation failed';
      const mockListResponse = {
          data: {
            results: [
              {
                id: 1,
                account_name: 'Test Account',
                account_number: '1234567890',
                status: 'active',
                customer: {
                  username: 'testuser',
                },
              },
            ],
            next: 'next_page_url',
            previous: 'prev_page_url',
          },
        };
    
        list.mockResolvedValueOnce(mockListResponse);
        render(<StaffDashboard />);
    
        await waitFor(() => {
          screen.findByText(/Test Account/i);
          screen.findByText(/1234567890/i);
          screen.findByText(/Activated/i);
          screen.findByText(/testuser/i);
        });
      closeAccount.mockRejectedValueOnce((errorMessage))
      
  
      fireEvent.click(screen.getByText("close")); 
      await waitFor(() => {
        screen.findByText(errorMessage)
      });
    })  
    test('handles pagination', async () => {
      const errorMessage="Loading Failed"
      const mockListResponse = {
        data: {
          results: [
            {
              id: 1,
              account_name: 'Test Account',
              account_number: '1234567890',
              status: 'pending',
              customer: {
                username: 'testuser',
              },
            },
          ],
          next: 'next_page_url',
          previous: 'prev_page_url',
        },
      };
  

  
      list.mockResolvedValueOnce(mockListResponse);
      pagination.mockRejectedValueOnce((errorMessage));
  
      render(<StaffDashboard />);
  
      await waitFor(() => {
        screen.findByText((errorMessage));
      
      });
      });
      test('handles search by name error', async () => {
        const searchName = 'John Doe';
        const errorMessage = 'Search failed';
        searchbyName.mockRejectedValueOnce((errorMessage));
        render(<StaffDashboard />);
        fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: searchName } });
        await waitFor(() => {
          expect(screen.findByText(errorMessage))
        });
      });

      test("handles sorting of accounts", async () => {
        const mockAccounts = [
          { id: 1, account_name: "Account 1", account_number: "123456", status: "active", customer: { username: "User1" } },
          { id: 2, account_name: "Account 2", account_number: "789012", status: "pending", customer: { username: "User2" } },
        ];
    
        list.mockResolvedValue({ data: { results: mockAccounts, next: null, previous: null } });

        render(<StaffDashboard />);
  
        const sortButton = screen.getByText(/Filter/i);
        userEvent.click(sortButton);
        
        await waitFor(() => {
        const account1 = screen.getByText(/Account 1/i);
        const account2 = screen.getByText(/Account 2/i);
        expect(account1).toBeInTheDocument();
        expect(account2).toBeInTheDocument();
        })
      });
      

      test("handles errors when fetching accounts", async () => {
        const errorMessage = "Failed to fetch accounts";
        list.mockRejectedValue(errorMessage);
    
        render(<StaffDashboard />);
    
        await waitFor(() => {
          screen.findByText(errorMessage);
         
        });
      });

      test("handles errors when paginating accounts", async () => {
        const errorMessage = "Failed to paginate accounts";
        const nextLink = "/api/accounts/?page=2";
        list.mockResolvedValueOnce({ data: { results: [], next: nextLink, previous: null } });
        pagination.mockRejectedValue((errorMessage));
    
        render(<StaffDashboard />);
        await waitFor(() => {
          screen.findByText(errorMessage);
        });
      });
    

  });
