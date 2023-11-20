import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StaffList from '../components/managercomponents/stafflist/StaffList';
import { list, staffAllow } from '../services/ApiServices';
import '@testing-library/jest-dom'



jest.mock('../services/ApiServices', () => ({
    ...jest.requireActual('../services/ApiServices'),
    list: jest.fn(),
    staffAllow: jest.fn(),
    pagination: jest.fn(),
}));

describe('StaffList Component', () => {
    test('renders user list allow', async () => {
        list.mockResolvedValueOnce({
            data: {
                results: [
                    {
                        id: 1,
                        username: 'TextUser',
                        email: 'TextUser@gmail.com',
                        user_type: '2',
                        user_position: 'Staff',
                        status: 'not allowed',
                    },

                ],
                next: 'next-url',
                previous: 'previous-url',
            },
        });

        render(<StaffList />);

        screen.findByText(/SL:No/i)
        screen.findByText(/User Name/i)
        screen.findByText(/Email/i)
        screen.findByText(/User Type/i)
        screen.findByText(/User Position/i)
        screen.findByText(/Status/i)
        screen.findByText(/Clear/i)
        
        await waitFor(() => {
            screen.findByText(/TextUser/i);
            screen.findByText(/TextUser@gmail.com/i);
            screen.findByText(/Staff/i);
            screen.findByText(/not allowed/i);
        });

        staffAllow.mockResolvedValueOnce({
            data: {
                message: 'User details updated successfully',
            },
        });
        fireEvent.click(screen.getByText('Allow'));
        await waitFor(() => {
            screen.findByText(/User details updated successfully/i)
            screen.findByText(/allowed/i);
        });
    });

    test('renders user list not allowed', async () => {
        list.mockResolvedValueOnce({
            data: {
                results: [
                    {
                        id: 1,
                        username: 'TextUser',
                        email: 'TextUser@gmail.com',
                        user_type: '2',
                        user_position: 'Staff',
                        status: 'allowed',
                    },

                ],
                next: 'next-url',
                previous: 'previous-url',
            },
        });

        render(<StaffList />);

        await waitFor(() => {
            screen.findByText(/TextUser/i);
            screen.findByText(/TextUser@gmail.com/i);
            screen.findByText(/Staff/i);
            screen.findByText(/allowed/i);
        });

        staffAllow.mockResolvedValueOnce({
            data: {
                message: 'User details updated successfully',
            },
        });
        fireEvent.click(screen.getByText('Allowed'));
        await waitFor(() => {
            screen.findByText(/User details updated successfully/i)
            screen.findByText(/not allowed/i);
        });
    });
});
