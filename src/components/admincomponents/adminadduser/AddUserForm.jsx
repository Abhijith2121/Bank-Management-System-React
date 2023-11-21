import React, { useState } from 'react';
import './adduserform.css'
import { addUserAccount } from '../../../services/ApiServices';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function AddUserForm() {
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setconfirmPassword] = useState('')
    const [email, setEmail] = useState('')
    const [userType, setUserType] = useState('1')
    const [message, setMessage] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const handleAddUser = async (e) => {
        e.preventDefault()
        const data = {
            username: userName,
            email: email,
            password: password,
            confirm_password: confirmPassword,
            user_type: userType
        }
        try {
            const response = await addUserAccount(data)
            response.data.message && (setMessage(response.data.message), setTimeout(() => setMessage(''), 2000));
        } catch (error) {
            setMessage(error)
        }
    }
    return (
        <div>
            <div className="page-wrapper p-t-45 p-b-50">
                <div className="wrapper wrapper--w790">
                    <div className="card card-5">
                        <div className="card-heading">
                            <h2 className="title">Add User</h2>
                        </div>
                        <div className="card-body">
                            <form method="POST">
                                {message && (
                                    <div className={`alert ${message === 'New Manager is Added Successfully' || message === 'New Staff is Added Successfully' ? 'alert-success' : 'alert-danger'}`}>
                                        {message}
                                    </div>      
                                )}
                                <div className="form-row">
                                    <div className="name">User Name</div>
                                    <div className="value">
                                        <div className="input-group">
                                            <input className="input--style-5 testusername" data-testid="username-input" type="text" name="company"
                                                value={userName} onChange={(e) => { setUserName(e.target.value) }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="name">Email</div>
                                    <div className="value">
                                        <div className="input-group">
                                            <input className="input--style-5" type="email" name="company" data-testid="email-input"
                                                value={email} onChange={(e) => { setEmail(e.target.value) }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="name">Password</div>
                                    <div className="value">
                                        <div className="input-group">
                                            <input className="input--style-5" data-testid="password-input" type={showPassword ? `text` : 'password'} name="company"
                                                value ={password} onChange={(e) => { setPassword(e.target.value) }} />
                                            <button
                                                className="password-toggle"
                                                type="button"
                                                data-testid="show-password2"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="name">Confirm Password</div>
                                    <div className="value">
                                        <div className="input-group">
                                            <input className="input--style-5" type={showConfirmPassword ? `text` : 'password'} name="company"
                                               data-testid="confirmpassword-input" value={confirmPassword} onChange={(e) => setconfirmPassword(e.target.value)} />
                                            <button
                                                className="password-toggle"
                                                type="button"
                                                data-testid="show-password"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="name">Account Type</div>
                                    <div className="dropdown" name='user type'>
                                        <select
                                            className="form-select"
                                            id="dropdown"
                                            data-testid="select-input"
                                            value={userType}
                                            onChange={(e) => setUserType(e.target.value)}
                                           
                                        >
                                            <option value="1">Manager</option>
                                            <option value="2">Staff</option>
                                        </select>

                                    </div>
                                </div>
                                <div className="text-center mt-3">
                                    <button className="btn btn--radius-2 btn--green ml-2" onClick={handleAddUser}>
                                        Add User
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
export default AddUserForm;
