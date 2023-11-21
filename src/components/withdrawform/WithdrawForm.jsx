import React,{useState,useEffect} from 'react';
import './withdrawform.css'
import { jwtDecode } from "jwt-decode";
import { withdraw } from '../../services/ApiServices';

function WithdrawForm() {

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
    authTokens?.access_token ? setAccountNumber(jwtDecode(authTokens.access_token)?.account_number) :null
  }, []);

 
  const handleWithdraw = async (e) => {
    e.preventDefault();
    const data = {
      account_number: accountNumber,
      amount: amount
    };
  
    try {
      const response = await withdraw(data);
      response.status === 200 && response.data.message === 'Withdraw Successfully' && (setMessage('Withdraw Successfully'), disappear(2000));
    } catch (error) {
      setMessage(error);
       disappear(2000)
    }
  };
  
  return (
    <div className="container">
      <div className="row"> 
        <div className="col-md-8">
          <div className="booking-form">
            <form method='POST'>
            {message && <div className={`alert ${message ==='Withdraw Successfully'? 'alert-success':'alert-danger'}`}>{message}</div>}
                  <div className="form-group">
                    <span className="form-label">Amount</span>
                    <input className="form-control" type="text" placeholder='amount' required
                     value={amount} onChange={(e)=>{setAmount(e.target.value)}}/>
                  </div>
              <div className="form-btn">
                <button type="submit" onClick={handleWithdraw} className="submit-btn" >Withdraw</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WithdrawForm;
