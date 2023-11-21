import React, { useState,useEffect } from 'react';
import { createAccount } from '../../services/ApiServices';
import './createaccount.css'
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";


function CreateAccount() {

const [accountName,setAccountName]=useState('')
const [message,setMessage]=useState('')
const navigate=useNavigate()

const handleCreateAccount=async(e)=>{
e.preventDefault()
const data={
    account_name:accountName
}

try {
    const response = await createAccount(data);

    setMessage(
        response.data.message === "Account Created Successfully"
          ? (() => {
              const accountAuthTokens = {
                access_token: response.data.access_token,
                refresh_token: response.data.refresh_token,
              };
              const accountNumber = jwtDecode(accountAuthTokens.access_token).account_number;
              const account = {
                account_name: accountName,
                account_number: accountNumber,
              };
              localStorage.setItem('authTokens', JSON.stringify(accountAuthTokens));
              localStorage.setItem('account', JSON.stringify(account));
              navigate('/bankservices');
              return "Account Created Successfully";
            })()
          : response.data.message === "Only customers can create accounts"
          ? "Only customers can create accounts."
          : response.data.message === "An account with this name already exists"
          ? "An account with this name already exists"
          : response.data.message === "Account Name is required"
          ? "Account Name is required"
          : undefined
      );
      
  } catch (error) {
   alert("Account Creation Faild"+error)
  }
};
    return (
        <div>
            <div className="page-wrapper p-t-45 p-b-50">
                <div className="wrapper wrapper--w790">
                    <div className="card card-5">
                        <div className="card-heading">
                            <h2 className="title">Create Account</h2>
                        </div>
                        <div className="card-body">
                            <form method="POST">
                                {message && <div className={`alert ${message ==='Account Created Successfully'? 'alert-success':'alert-danger'}`}>{message}</div>}
                                <div className="form-row">
                                    <div className="name">Account Name</div>
                                    <div className="value">
                                        <div className="input-group">
                                            <input
                                                className="input--style-5"
                                                type="text"
                                                name="company"
                                                data-testid="account-input"
                                                value={accountName}
                                                onChange={(e)=>setAccountName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="text-center mt-3">
                                    <button
                                        className="btn btn--radius-2 btn--green ml-2"
                                        type="submit" onClick={handleCreateAccount} >
                                        Go to My Account
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateAccount;
