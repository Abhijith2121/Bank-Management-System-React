import React, { useState } from 'react';
import adminPage from './draw2.webp'
import './adminlogin.css'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { adminLogin } from '../../../services/ApiServices';
import { useNavigate } from 'react-router-dom';

const apiendpoint = process.env.REACT_APP_API_ENDPOINT;

function Adminlogin() {
  const [userName, setuserName] = useState('');
  const [password, setpassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()

  const handlelogin = async (e) => {
    e.preventDefault();

    const data = {
      username: userName,
      password: password
    }

    try {
      const response = await adminLogin(data)
      
      const adminAuthTokens = {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
      };
     
      localStorage.setItem('adminAuthTokens', JSON.stringify(adminAuthTokens));
      navigate('/admindashboard')

    } catch (err) {
      alert("User Registration failed: " + err.message);
    }
  };


  return (
    <div>
      <section class="vh-100">
        <div class="container-fluid h-custom">
          <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-md-9 col-lg-6 col-xl-5">
              <img src={adminPage}
                class="img-fluid" alt="Sample image" />
            </div>
            <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              <form method='POST'>


                <div class="divider d-flex align-items-center my-4">
                  <h2 class="text-center fw-bold mx-3 mb-0">Admin Login</h2>
                </div>


                <div class="form-outline mb-4">
                  <input type="text" id="form3Example3" class="form-control form-control-lg"
                    placeholder="Enter Username" value={userName} onChange={(e) => { setuserName(e.target.value) }} />

                </div>


                <div class="form-outline mb-3">
                  <input type={showPassword ? 'text' : 'password'} id="form3Example4" class="form-control form-control-lg"
                    placeholder="Enter password" value={password} onChange={(e) => { setpassword(e.target.value) }} />
                  <button
                    className="password-toggle showpassword"
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>

                </div>



                <div class="text-center text-lg-start mt-4 pt-2">
                  <button type="button" class="btn btn-primary btn-lg custom" onClick={handlelogin}>Login</button>

                </div>

              </form>
            </div>
          </div>
        </div>



      </section>
    </div>
  );
}

export default Adminlogin;
