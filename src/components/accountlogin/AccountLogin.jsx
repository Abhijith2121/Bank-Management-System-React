import React, { useState, useEffect } from 'react';
import { accountLogin } from '../../services/ApiServices';
import './accountlogin.css'
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";


function AccountLogin() {

    const [accountNumber, setAccountNumber] = useState('')
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    const handleAccountLogin = async (e) => {
        e.preventDefault()
        const data = {
            account_number: accountNumber
        }
        try {
            const response = await accountLogin(data);
            const messageMapping = {
                "Account Login Successful": {
                    message: "Account Login Successful",
                    action: () => {
                        const accountAuthTokens = {
                            access_token: response.data.access_token,
                            refresh_token: response.data.refresh_token,
                        };
                        const decodedToken = jwtDecode(accountAuthTokens.access_token);
                        const account = {
                            account_name: decodedToken.account_name,
                            account_number: decodedToken.account_number,
                        };

                        localStorage.setItem('authTokens', JSON.stringify(accountAuthTokens));
                        localStorage.setItem('account', JSON.stringify(account));
                        navigate('/bankservices');
                    }
                },
                "Account Number is required": { message: "Account Number is required" },
                "Account not found": { message: "Account not found" },
                "Invalid Account Number": { message: "Invalid Account Number" },
                "Unauthorized access": { message: "Unauthorized access" },
            }
            const selectedMessage = messageMapping[response.data.message]
            selectedMessage && (setMessage(selectedMessage.message), selectedMessage.action && selectedMessage.action());

        }
        catch (error) {
            setMessage(error.message)
        }
    };
    return (
        <div>
            <div className="page-wrapper p-t-45 p-b-50">
                <div className="wrapper wrapper--w790">
                    <div className="card card-5">
                        <div className="card-heading">
                            <h2 className="title">Account Login</h2>
                        </div>
                        <div className="card-body">
                            <form method="POST">
                                {message && <div className={`alert ${message === 'Account Login Successful' ? 'alert-success' : 'alert-danger'}`}>{message}</div>}
                                <div className="form-row">
                                    <div className="name">Account Number</div>
                                    <div className="value">
                                        <div className="input-group">
                                            <input
                                                className="input--style-5"
                                                type="text"
                                                name="company"
                                                value={accountNumber}
                                                onChange={(e) => setAccountNumber(e.target.value)}
                                                placeholder='Account Number'
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center mt-3">
                                    <button
                                        className="btn btn--radius-2 btn--green ml-2"
                                        type="submit" onClick={handleAccountLogin} >
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

export default AccountLogin;
