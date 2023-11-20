import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import UpdateUser from '../components/managercomponents/updateuser/UpdateUser';
import { userDetail,userDetailUpdate } from '../services/ApiServices';
import '@testing-library/jest-dom';

jest.mock('../services/ApiServices', () => ({
    ...jest.requireActual('../services/ApiServices'),
    userDetail: jest.fn(),
    userDetailUpdate:jest.fn()
}))

describe('UpdateUser Component', () => {
  test('renders update user form', async () => {
    const userId = 'mockUserId';

    userDetail.mockResolvedValue({
      data: {
        id: userId,
        username: 'mockUsername',
        email: 'mock@gmail.com',
        user_type: 'mockUserType',
        user_position: 'mockUserPosition',
        status: 'not allowed',
      },
    });

    userDetailUpdate.mockResolvedValue({
      data: {
        message: 'User updated successfully',
      },
    });

    render(
      <MemoryRouter initialEntries={[`/updateuser/${userId}`]}>
          <UpdateUser />
      </MemoryRouter>
    );

  
    await waitFor(() => {
      expect(screen.getByDisplayValue('mockUsername')).toBeInTheDocument();
      expect(screen.getByDisplayValue('mock@gmail.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('mockUserType')).toBeInTheDocument();
      expect(screen.getByDisplayValue('mockUserPosition')).toBeInTheDocument();
      expect(screen.getByDisplayValue('not allowed')).toBeInTheDocument();

      fireEvent.change(screen.getByDisplayValue('mockUserType'), { target: { value: 'updatedUserType' } });
    });

    fireEvent.click(screen.getByText('Update'));
    await waitFor(() => {
      expect(userDetailUpdate).toHaveBeenCalledWith(userId, {
        username: 'mockUsername',
        email: 'mock@gmail.com',
        user_type: 'updatedUserType',
        user_position: 'mockUserPosition',
        status: 'not allowed',
      });

      expect(screen.getByText('User updated successfully')).toBeInTheDocument();
    });
  });
  test('handles API fails', async () => {
    userDetail.mockRejectedValue(('Failed to fetch user details'));
  
    render(
      <MemoryRouter initialEntries={[`/updateuser/mockUserId`]}>
        <UpdateUser />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.findByText('Failed to fetch user details'))
    });
  });
  test('handles userDetailUpdate API fails', async () => {
    userDetailUpdate.mockRejectedValue(('Failed to update user details'));
  
    render(
      <MemoryRouter initialEntries={[`/updateuser/mockUserId`]}>
        <UpdateUser />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Update'));
    await waitFor(() => {
      expect(screen.findByText('Failed to update user details'))
    });
  });

  test('displays validation error for empty fields', async () => {
    render(
      <MemoryRouter initialEntries={[`/updateuser/mockUserId`]}>
        <UpdateUser />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('Update'));
  
    await waitFor(() => {
      expect(screen.findByText('Please fill in all fields'))
    });
  })
});
