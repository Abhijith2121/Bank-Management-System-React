import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserList from '../components/managercomponents/userlist/UserList';
import { MemoryRouter } from 'react-router-dom';
import { list } from '../services/ApiServices';

jest.mock('../services/ApiServices', () => ({
  ...jest.requireActual('../services/ApiServices'),
  list: jest.fn(),
}));

describe('UserList Component', () => {
  test('renders user list', async () => {
   
    list.mockResolvedValueOnce({
      data: {
        results: [
          {
            id: 1,
            username: 'TestUser',
            email: 'TestUser@gmail.com',
            user_type: '3',
            user_position: 'Customer',
            status: 'active',
          },
        ],
        next: 'next-url',
        previous: 'previous-url',
      },
    });
    
    render(<MemoryRouter><UserList /></MemoryRouter>);

        screen.findByText(/SL:No/i)
        screen.findByText(/User Name/i)
        screen.findByText(/Email/i)
        screen.findByText(/User Type/i)
        screen.findByText(/User Position/i)
        screen.findByText(/Status/i)
        screen.findByText(/Update/i)

    await waitFor(async()=>{
        screen.findByText(/TestUser/i)
        screen.findByText(/TestUser@gmail.com/i)
        screen.findByText(/Customer/i)
        screen.findByText(/active/i)
    })
  });
});
