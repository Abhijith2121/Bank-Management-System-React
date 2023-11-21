import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { list,pagination ,staffAllow,searchbyName} from '../services/ApiServices';
import StaffList from '../components/managercomponents/stafflist/StaffList';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

jest.mock('../services/ApiServices', () => ({
    ...jest.requireActual('../services/ApiServices'),
    list: jest.fn(),
    pagination:jest.fn(),
    staffAllow:jest.fn(),
    searchbyName:jest.fn()
  }));

const mockedUsers = [
  {
    id: 1,
    username: 'user1',
    email: 'user1@example.com',
    user_type: '2',
    user_position: 'Staff',
    status: 'not allowed',
  },

];

const mockedResponse = {
  data: {
    results: mockedUsers,
    next: 'next-page',
    previous: 'previous-page',
  },
};

describe('UserList Component', () => {
  beforeEach(() => {
    list.mockResolvedValue(mockedResponse);
  });

  test('renders user list', async () => {
    render(
        <MemoryRouter>
         <StaffList/>
        </MemoryRouter>   
    );
    expect(screen.findByText('user1'));
    expect(screen.findByText('user1@example.com'));
    expect(screen.findByText('Staff'));
    expect(screen.findByText('Active'));
    await waitFor(()=>{
        expect(list).toHaveBeenCalledWith('staffs/')
    })
  });
  test('allows staff', async () => {
    const mockedUsers = [
      {
        id: 1,
        username: 'user1',
        email: 'user1@example.com',
        user_type: '2',
        user_position: 'Staff',
        status: 'not allowed',
      },
    ]
    
    list.mockResolvedValueOnce({ data: { results: mockedUsers, next: null, previous: null } })
    staffAllow.mockResolvedValueOnce({ data: { message: 'User details updated successfully' } });

    render(<StaffList />);


    await waitFor(() => {
      mockedUsers.forEach((user) => {
        expect(screen.findByText(user.username))
        expect(screen.findByText(user.email))
      });
    });


    const allowButton = screen.getByText('Allow');
    fireEvent.click(allowButton);
    await waitFor(() => {

      expect(staffAllow).toHaveBeenCalledWith(1,{"status": "allowed"});
      expect(screen.findByText('User details updated successfully'))
    });
    await waitFor(() => {
      expect(list).toHaveBeenCalledTimes(2); 
    });
  });


  test('not allows staff', async () => {
    const mockedUsers = [
      {
        id: 1,
        username: 'user1',
        email: 'user1@example.com',
        user_type: '2',
        user_position: 'Staff',
        status: 'allowed',
      },
    ]
    
    list.mockResolvedValueOnce({ data: { results: mockedUsers, next: null, previous: null } })
    staffAllow.mockResolvedValueOnce({ data: { message: 'User details updated successfully' } });

    render(<StaffList />);


    await waitFor(() => {
      mockedUsers.forEach((user) => {
        expect(screen.findByText(user.username))
        expect(screen.findByText(user.email))
      });
    });


    const allowButton = screen.getByText('Allowed');
    fireEvent.click(allowButton);
    await waitFor(() => {

      expect(staffAllow).toHaveBeenCalledWith(1,{"status": "not allowed"});
      expect(screen.findByText('User details updated successfully'))
    });
    
  }); 

  test('allows staff error', async () => {
    const mockedUsers = [
      {
        id: 1,
        username: 'user1',
        email: 'user1@example.com',
        user_type: '2',
        user_position: 'Staff',
        status: 'not allowed',
      },
    ]
    
    list.mockResolvedValueOnce({ data: { results: mockedUsers, next: null, previous: null } })
    staffAllow.mockRejectedValueOnce(('Failed to allow staff'));
    render(<StaffList />);
    await waitFor(() => {
      mockedUsers.forEach((user) => {
        expect(screen.findByText(user.username))
        expect(screen.findByText(user.email))
      });
    });

    const allowButton = screen.getByText('Allow');
    fireEvent.click(allowButton);
    await waitFor(() => {

      expect(staffAllow).toHaveBeenCalledWith(1,{"status": "allowed"});
      expect(screen.findByText('Failed to allow staff'))
    });
   
  });

  test('not allow staff error', async () => {
    const mockedUsers = [
      {
        id: 1,
        username: 'user1',
        email: 'user1@example.com',
        user_type: '2',
        user_position: 'Staff',
        status: 'allowed',
      },
    ]
    
    list.mockResolvedValueOnce({ data: { results: mockedUsers, next: null, previous: null } })
    staffAllow.mockRejectedValueOnce(('Failed to not allow staff'));

    render(<StaffList />);

    await waitFor(() => {
      mockedUsers.forEach((user) => {
        expect(screen.findByText(user.username))
        expect(screen.findByText(user.email))
      });
    });

    const allowButton = screen.getByText('Allowed');
    fireEvent.click(allowButton);
    await waitFor(() => {

      expect(staffAllow).toHaveBeenCalledWith(1,{"status": "not allowed"});
      expect(screen.findByText('Failed to allow staff'))
    });
   
  });
  test(' search API fails', async () => {
    searchbyName.mockRejectedValueOnce(('Failed to search staff'));
    render(<StaffList />);

    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'user' } });

    await waitFor(() => {
      expect(screen.findByText('Failed to search staff'))
    });

  });

  test('navigates through pagination', async () => {
    const nextLink = "next-page"
    const previousLink = 'previous-page';
  
    pagination.mockResolvedValueOnce({ data: { results: [], next: nextLink, previous: previousLink } });
    pagination.mockResolvedValueOnce({ data: { results: [], next: null, previous: null } });
  
    render(<StaffList />);
  
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    });
  
    const nextButton = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(nextButton);
  
    await waitFor(() => {
      expect(pagination).toHaveBeenCalledWith("next-page");
    });
  
    const previousButton = screen.getByRole('button', { name: 'Previous' });
    fireEvent.click(previousButton);
  
    await waitFor(() => {
      expect(pagination).toHaveBeenCalledWith("previous-page");
    });
  });
  

  
  test('handles Next and Previous buttons for pagination', async () => {
    const nextLink = 'next-link';
    const previousLink = 'previous-link';
  
    pagination.mockResolvedValueOnce({ data: { results: [], next: nextLink, previous: previousLink } });
  
    render(<StaffList />)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    });
    await waitFor(() => {
    expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
  });
  });

  test('renders error message when fetching users', async () => {
    list.mockRejectedValueOnce('Failed to fetch users.');
  
    render(<StaffList />);
  
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch users.')).toBeInTheDocument();
    });
  });

  test('renders error message when fetching users', async () => {
    const errorMessage = 'Failed to fetch users.';
    list.mockRejectedValueOnce(errorMessage);
  
    render(
      <MemoryRouter>
        <StaffList />
      </MemoryRouter>
    );
  
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
 
});
