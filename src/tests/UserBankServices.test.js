import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import UserBankServices from '../components/usercomponents/userdashboard/userbankservices/UserBankServices';
import '@testing-library/jest-dom';

describe('UserBankServices Component', () => {
  test('renders services', () => {
    render(
      <Router>
        <UserBankServices />
      </Router>
    );

    const depositLink = screen.getByText('Deposit');
    expect(depositLink).toBeInTheDocument();
    const withdrawLink = screen.getByText('Withdraw');
    expect(withdrawLink).toBeInTheDocument();
    const transactionHistoryLink = screen.getByText('Transaction History');
    expect(transactionHistoryLink).toBeInTheDocument();
  });
});
