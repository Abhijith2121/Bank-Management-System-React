import React, { useState } from 'react';
import signupimage from './signup-image.jpg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Heading from '../Heading';
import './register.css'

const apiendpoint = process.env.REACT_APP_API_ENDPOINT;
function UserSignup() {
    const [userName, setuserName] = useState('');
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [confirmPassword, setconfirmPassword] = useState('');
    const [message, setMessage] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate()

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiendpoint}signup/`, {
                username: userName,
                email: email,
                password: password,
                confirm_password: confirmPassword
            });
            if (response.data.message === "Registered Successfully") {
                setMessage("Registered Successfully");
                navigate('/login');
            } else {
                if (response.data.message && Array.isArray(response.data.message)) {
                    const errorMessage = response.data.message.join(' ');
                    setMessage(errorMessage);
                } else if (response.data.message === "Password does not match") {
                    setMessage("Password does not match");
                } else if (response.data.message === "Email Already Exists") {
                    setMessage("Email Already Exists");
                } else if (response.data.message === "Username already in use") {
                    setMessage("Username already in use");
                } else if (response.data.message === "Username is required") {
                    setMessage("Username is required");
                } else if (response.data.message === "Password is required") {
                    setMessage("Password is required");
                } else if (response.data.message === "Please confirm the password") {
                    setMessage("Please confirm the password");
                } else if (response.data.message === "Email is required") {
                    setMessage("Email is required");
                } else if (response.data.message === "All fields are required") {
                    setMessage("All fields are required");
                }
            }
        } catch (err) {
            alert("User Registration failed: " + err.message);
        }
    };
    return (
        <div>
            <section className="signup">
                <div className="container">
                    <div className="signup-content">
                        <div className="signup-form">
                            <Heading text="sign up" />
                            <form method="POST" className="register-form" id="register-form">
                                {message && <div className={`alert ${message === 'successfully registered' ? 'alert-success' : 'alert-danger'}`}>{message}</div>}
                                <div className="form-group">
                                    <label htmlFor="firstname"><i className="zmdi zmdi-account material-icons-name"></i></label>
                                    <input type="text" name="name" id="firstname" placeholder="User Name"
                                        value={userName} onChange={(e) => { setuserName(e.target.value) }} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email"><i className="zmdi zmdi-email"></i></label>
                                    <input type="email" name="email" id="email" placeholder="Email"
                                        value={email} onChange={(e) => { setemail(e.target.value) }} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="pass"><i className="zmdi zmdi-lock"></i></label>
                                    <input type={showPassword ? "text" : "password"} name="pass" id="pass" placeholder="Password"
                                        value={password} onChange={(e) => { setpassword(e.target.value) }} />
                                    <button
                                        className="password-toggle showpassword"
                                        type='button'
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="re-pass"><i className="zmdi zmdi-lock-outline"></i></label>
                                    <input type={showConfirmPassword ? "text" : "password"} name="re_pass" id="re_pass" placeholder="Confirm Password"
                                        value={confirmPassword} onChange={(e) => { setconfirmPassword(e.target.value) }} />
                                    <button
                                        className="password-toggle showpassword"
                                        type='button'
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>

                                <div className="form-group form-button">
                                    <input type="submit" name="signup" id="signup" className="form-submit" value="Register"
                                        onClick={handleSignup} />
                                </div>

                            </form>
                        </div>
                        <div className="signup-image">
                            <figure>
                                <img src={signupimage} alt="sign up image" />
                            </figure>
                            <a href="/login" className="signup-image-link">I am already a member</a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default UserSignup;
