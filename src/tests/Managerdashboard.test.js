import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ManagerDashboard from '../components/managercomponents/managerdashboard/ManagerDashboard';
import '@testing-library/jest-dom';

test('renders ManagerDashboard component', () => {
  render(
    <MemoryRouter>
      <ManagerDashboard />
    </MemoryRouter>
  );

  screen.findByText(/Manager panel/i);
  const staffsButton = screen.getByRole('button', { name: /staffs/i });
  const customersButton = screen.getByRole('button', { name: /customers/i });
  expect(staffsButton).toBeInTheDocument();
  expect(customersButton).toBeInTheDocument();
});
