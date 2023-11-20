import React, { useState, useEffect } from 'react';
import './depositform.css';
import { deposit } from '../../services/ApiServices';
import { jwtDecode } from "jwt-decode";

function DepositForm() {
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const authTokens = JSON.parse(localStorage.getItem('authTokens'));
    console.log(authTokens);
    if (authTokens && authTokens.access_token) {
      const decodedToken = jwtDecode(authTokens.access_token);
      const username = decodedToken.username;
      const accountNumber1 = decodedToken.account_number;
      setAccountNumber(decodedToken.account_number);
    } else {
      console.log("No token");
    }
  }, []);

  const handleDeposit = async (e) => {
    e.preventDefault();
    
    const data = {
      account_number: accountNumber,
      amount: amount
    };
  
    try {
      const response = await deposit(data);
      if (response.status === 200) {
        if (response.data.message === "Deposit Successfully") {
          setMessage("Amount Deposited");
          const timeoutId = setTimeout(() => {
            setMessage('');
          }, 2000);
        }
      }
    } catch (error) {
      setMessage(error);
       setTimeout(() => {
        setMessage('');
      }, 2000);
    }
  };
  

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-4 mb-4 order-md-2">
          
        </div>
        <div className="col-md-8">
          <div className="booking-form">
            <form method="POST">
            {message && <div className={`alert ${message ==='Amount Deposited'? 'alert-success':'alert-danger'}`}>{message}</div>}
                  <div className="form-group">
                    <span className="form-label">Amount</span>
                    <input className="form-control" placeholder='amount' type="text" value={amount} onChange={(e)=>{setAmount(e.target.value)}} required
                   />
                  </div>
              <div className="form-btn">
                <button className="submit-btn"  type="submit" onClick={handleDeposit} >Deposit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}



export default DepositForm;
