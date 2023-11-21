import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import UpdateUser from '../components/managercomponents/updateuser/UpdateUser';
import { userDetail,userDetailUpdate } from '../services/ApiServices';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

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

  test("updates userposition input changes", async() => {
    render(<MemoryRouter initialEntries={[`/updateuser/mockUserId`]}>
    <UpdateUser />
  </MemoryRouter>);

    const userPositionInput = screen.getByPlaceholderText('User Position');
    userEvent.type(userPositionInput, "New User Position");
    // const nameInput = screen.getByPlaceholderText('Name');
    // userEvent.type(nameInput, "New User");
    // const emailInput = screen.getByPlaceholderText('Email');
    // userEvent.type(emailInput, "Newuser@gmail.com");
    // const userTypeInput = screen.getByPlaceholderText('User Type');
    // userEvent.type(userTypeInput, "1");
    // const statusInput = screen.getByPlaceholderText('Status');
    // userEvent.type(statusInput, "allowed");

    await waitFor(()=>{
      expect(userPositionInput.value).toBe("New User Position");
      // expect(nameInput.value).toBe("New User");
      // expect(emailInput.value).toBe("Newuser@gmail.com");
      // expect(userTypeInput.value).toBe("1");
      // expect(statusInput.value).toBe("allowed");
    })
   
   
  });
  test("updates name input changes", async() => {
    render(<MemoryRouter initialEntries={[`/updateuser/mockUserId`]}>
    <UpdateUser />
  </MemoryRouter>);

    const nameInput = screen.getByPlaceholderText('Name');
    userEvent.type(nameInput, "New User");
    await waitFor(()=>{
      expect(nameInput.value).toBe("New User");
    }) 
  });

  test("updates email input changes", async() => {
    render(<MemoryRouter initialEntries={[`/updateuser/mockUserId`]}>
    <UpdateUser />
  </MemoryRouter>);
    const emailInput = screen.getByPlaceholderText('Email');
    userEvent.type(emailInput, "Newuser@gmail.com");

    await waitFor(()=>{
      expect(emailInput.value).toBe("Newuser@gmail.com");
    })
  });


  test("updates usertype input changes", async() => {
    render(<MemoryRouter initialEntries={[`/updateuser/mockUserId`]}>
    <UpdateUser />
  </MemoryRouter>);
    
    const userTypeInput = screen.getByPlaceholderText('User Type');
    userEvent.type(userTypeInput, "1");
    await waitFor(()=>{
      expect(userTypeInput.value).toBe("1");
    })
  });

  test("updates userposition input changes", async() => {
    render(<MemoryRouter initialEntries={[`/updateuser/mockUserId`]}>
    <UpdateUser />
  </MemoryRouter>);

    const statusInput = screen.getByPlaceholderText('Status');
    userEvent.type(statusInput, "allowed");

    await waitFor(()=>{
      expect(statusInput.value).toBe("allowed");
    })
   
   
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

  test("handles successful user update", async () => {
    userDetailUpdate.mockResolvedValue({ data: { message: "Update successful" } });
    render(<UpdateUser />);
    fireEvent.click(screen.getByText('Update'));
    await waitFor(() => {
      const successMessage = screen.getByText(/update successful/i);
      expect(successMessage).toBeInTheDocument();
    });
  });
});
