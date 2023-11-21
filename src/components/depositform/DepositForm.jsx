import React, { useState, useEffect } from 'react';
import './depositform.css';
import { deposit } from '../../services/ApiServices';
import { jwtDecode } from "jwt-decode";

function DepositForm() {
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [message, setMessage] = useState('');


  const disappear=(time)=>{
    setTimeout(() => {
        setMessage('');
      }, time);
}

  useEffect(() => {
    const authTokens = JSON.parse(localStorage.getItem('authTokens'));
    authTokens?.access_token ? setAccountNumber(jwtDecode(authTokens.access_token)?.account_number):console.log("No Tokens")
  }, []);

  const handleDeposit = async (e) => {
    e.preventDefault();
    
    const data = {
      account_number: accountNumber,
      amount: amount
    };
  
    try {
      const response = await deposit(data);
      response.status === 200 && response.data.message === 'Deposit Successfully' && (setMessage('Amount Deposited'), disappear(2000));
    } catch (error) {
      setMessage(error);
      disappear(2000)
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
