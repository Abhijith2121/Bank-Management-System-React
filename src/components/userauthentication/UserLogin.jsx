import React, { useState } from 'react';
import './register.css'
import signinmage from './signin-image.jpg';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";


const apiendpoint = process.env.REACT_APP_API_ENDPOINT;
function UserLogin() {

    const [userName, setuserName] = useState('');
    const [password, setpassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('')
    
    
    const navigate = useNavigate()
    const handlelogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiendpoint}login/`, {
                username: userName,
                password: password,
            });
            setMessage(response.data.message)
            const userType=response.data.user_type
            const authTokens = {
                access_token: response.data.access_token,
                refresh_token: response.data.refresh_token,
            };
            localStorage.setItem('authTokens', JSON.stringify(authTokens));
            const dashboardMapping = {
                "1": "/managerdashboard",
                "2": "/staffdashboard",
                "3": "/userdashboard",
              };
            
              navigate(dashboardMapping[userType] || "/login");
              
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <div>
            <section class="sign-in"> 
                <div class="container">
                    <div class="signin-content">
                        <div class="signin-image">
                            <figure><img src={signinmage} alt="sing up image" /></figure>
                            <a href="/signup" class="signup-image-link">Create an account</a>
                        </div>
                        <div class="signin-form">
                            <h2 class="form-title">Sign in</h2>
                            <form method="POST" class="register-form" id="login-form">
                                {message && <div className={`alert ${message === 'successfully registered' ? 'alert-success' : 'alert-danger'}`}>{message}</div>}
                                <div class="form-group">
                                    <label for="your_name"><i class="zmdi zmdi-account material-icons-name"></i></label>
                                    <input type="text" name="your_name" id="your_name" data-testid="user-name-input" placeholder="User Name"
                                        value={userName} onChange={(e) => { setuserName(e.target.value) }} />
                                </div>
                                <div class="form-group">
                                    <label for="your_pass"><i class="zmdi zmdi-lock"></i></label>
                                    <input type={showPassword ? "text" : "password"} name="your_pass" id="your_pass" placeholder="Password"
                                        value={password} onChange={(e) => { setpassword(e.target.value) }} />
                                    <button
                                        className="password-toggle showpassword"
                                        type='button'
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                <div class="form-group form-button">
                                    <input type="submit" name="signin" id="signin" class="form-submit"
                                        value="Signin" onClick={handlelogin} />
                                </div>
                                    <Link to='/forgetpassword'><button className="btn btn-link text-info forget-password">
                                        Forget Password?
                                    </button></Link>       
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
export default UserLogin