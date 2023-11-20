import React, { useState } from 'react';
import { CRow, CCol, CFormInput } from '@coreui/react';
import { Button } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { forgetPassword } from '../../services/ApiServices';
import { Link } from 'react-router-dom';

function ForgetPassword() {
    const [forgetPasswordEmail, setForgetPasswordEmail] = useState('');
    const [forgetPasswordNewPassword, setForgetPasswordNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');

    const data = {
        email: forgetPasswordEmail,
        new_password: forgetPasswordNewPassword
    };

    const handleResetPassword = async () => {
        console.log("Hii");
        try {
            const response = await forgetPassword(data);
            console.log("Reset Password", response.data.message);
            setMessage(response.data.message);
            const timeoutId = setTimeout(() => {
                setMessage('');
              }, 2000);
        } catch (error) {
            console.error(error);
            const timeoutId = setTimeout(() => {
                setMessage('');
              }, 2000);
        }
    };

    return (
        <div className="text-center mt-4">
            <h2>Reset Password</h2>
            <CRow className="justify-content-center mt-4">

                <CCol xs="12" sm="6" md="4">
                    {message && <div className={`alert ${message === 'Password reset successfully' ? 'alert-success' : 'alert-danger'}`}>{message}</div>}
                    <div className="mb-3">
                        <CFormInput
                            id="email"
                            size="sm"
                            placeholder="Enter your email"
                            aria-label="Email"
                            type="email"
                            value={forgetPasswordEmail}
                            onChange={(e) => setForgetPasswordEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <CFormInput
                            id="newPassword"
                            size="sm"
                            placeholder="Enter your new password"
                            aria-label="New Password"
                            type={showPassword ? "text" : "password"}
                            value={forgetPasswordNewPassword}
                            onChange={(e) => setForgetPasswordNewPassword(e.target.value)}
                        />
                        <button
                            className="password-toggle"
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </CCol>
            </CRow>
            <Button variant="primary" onClick={() => handleResetPassword()}>
                Reset Password
            </Button>
            <div className='mt-3'>
            <Link to='/login'>
                Back to Login
            </Link>
            </div>
        </div>
    );
}

export default ForgetPassword;
