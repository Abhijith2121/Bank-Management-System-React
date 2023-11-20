import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css';
import { Nav, Navbar, Container, NavDropdown } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { closeAccount } from '../../../services/ApiServices';
import { Alert, Button } from 'react-bootstrap';


function Header() {

  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { accountName } = useAuth();
  const navigate = useNavigate();

  const storedTokens = JSON.parse(localStorage.getItem('authTokens'));
  const adminStoredTokens = JSON.parse(localStorage.getItem('adminAuthTokens'));
  const accountHolder = JSON.parse(localStorage.getItem('account'))
  const isAuthenticated = storedTokens && storedTokens.access_token;
  const adminIsAuthenticated = adminStoredTokens && adminStoredTokens.access_token;


  const handleSignout = () => {
    if (isAuthenticated) {
      localStorage.removeItem('authTokens');
      localStorage.removeItem('account');
      navigate('/login');
    }
    if (adminIsAuthenticated) {
      localStorage.removeItem('adminAuthTokens');
      navigate('/admin');
    }
  }

  const handleAccountLogout = () => {
    if (isAuthenticated) {
     
      localStorage.removeItem('account');
      navigate('/userdashboard');
    }
    if (adminIsAuthenticated) {
      localStorage.removeItem('adminAuthTokens');
      navigate('/admin');
    }
  }


  const handleConfirmation = () => {
    setShowConfirmation(true);
  };

  const handleCloseAccount = async () => {
    console.log(accountHolder);
    setShowConfirmation(false);
    if (accountHolder && accountHolder.account_number) {
      try {
        const response = await closeAccount(accountHolder.account_number);
        setMessage(response.data.message);

      } catch (error) {
        setMessage(error)
      }
    } else {
      console.error('Invalid accountHolder or account_number');
    }
  };


  useEffect(() => {
    const authTokens = JSON.parse(localStorage.getItem('authTokens'));

    if (authTokens && authTokens.access_token) {
      const decodedToken = jwtDecode(authTokens.access_token);
      const username = decodedToken.username;
      setUserName(username);
    } else {
      console.log("No token");
    }
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-3">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Innovature Labs</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link mx-2 active" aria-current="page" href="/">Home</a>
              </li>
             
              {
                (isAuthenticated || adminIsAuthenticated) ? (
                  <li className="nav-item">
                    <a className="nav-link mx-2" onClick={handleSignout} href="#">Sign Out</a>
                  </li>
                ) : null
              }

              {
                accountHolder ? (
                  <li className="nav-item dropdown">
                    <a className="nav-link mx-2 dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Services
                    </a>
                    <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                      <li><a className="dropdown-item" href="/deposit">Deposit</a></li>
                      <li><a className="dropdown-item" href="/withdraw">Withdraw</a></li>
                      <li><a className="dropdown-item" href="/transactions">Transaction History</a></li>
                    </ul>
                  </li>
                ) : null
              }
              {
                (accountHolder) ? (
                  <li className="nav-item">
                    <a className="nav-link mx-2" onClick={handleConfirmation} href="#">Close Account</a>
                  </li>
                ) : null
              }
              {
              (accountHolder) ? (
                  <li className="nav-item">
                    <a className="nav-link mx-2" onClick={handleAccountLogout} href="#">Account Logout</a>
                  </li>
                ) : null
              }

            </ul>
          </div>
        </div>
      </nav>
      {message && (
        <Alert variant="info">
          {message}
        </Alert>
      )}
      {showConfirmation && (
        <Alert variant="danger">
          Are you sure you want to close your account?
          <Button variant="danger" className="mx-2" onClick={() => handleCloseAccount(accountHolder.account_number)}>Yes, Close Account</Button>
          <Button variant="info" className="mx-2" onClick={() => setShowConfirmation(false)}>Cancel</Button>
        </Alert>
      )}
    </>
  );
}

export default Header;
