import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { list,pagination,searchbyName } from '../services/ApiServices';
import UserList from '../components/managercomponents/userlist/UserList';
import '@testing-library/jest-dom';



jest.mock('../services/ApiServices', () => ({
    ...jest.requireActual('../services/ApiServices'),
    list: jest.fn(),
    pagination:jest.fn(),
    searchbyName:jest.fn()
  }));

const mockedUsers = [
  {
    id: 1,
    username: 'user1',
    email: 'user1@example.com',
    user_type: '3',
    user_position: 'Customer',
    status: 'not allowd',
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
         <UserList />
        </MemoryRouter>   
    );
     expect(screen.findByText('user1'));
     expect(screen.findByText('user1@example.com'));
     expect(screen.findByText('Customer'));
     expect(screen.findByText('not allowed'));
    
    await waitFor(()=>{
        expect(list).toHaveBeenCalledWith('customers/')
    })
  });

  test('handles pagination', async () => {
    render(
      <MemoryRouter>
        <UserList />
      </MemoryRouter>
    );

   
    await waitFor(async () => {
      const nextButton = screen.getByRole('button', { name: /Next/i });
      expect(nextButton).toBeInTheDocument();
      fireEvent.click(nextButton);
      await expect(pagination).toHaveBeenCalledWith('next-page');
    });
  });

  // test('handles search', async () => {
  //   render(
  //     <Router>
  //       <UserList />
  //     </Router>
  //   );

  //   const searchInput = screen.getByPlaceholderText('Search...');
  //   fireEvent.change(searchInput, { target: { value: 'user1' } });

  //   const searchButton = screen.getByTestId('search-icon');
  //   fireEvent.click(searchButton);

  //   await waitFor(() => {
  //     expect(axios.get).toHaveBeenCalledWith('/searchuser/?search=user1');
  //   });
  // });

  test(' search API fails', async () => {
    searchbyName.mockRejectedValueOnce(('Failed to search staff'));
    render(<MemoryRouter>
      <UserList />
     </MemoryRouter>);

    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'user' } });

    await waitFor(() => {
      expect(screen.findByText('Failed to search staff'))
    });

  });
});
