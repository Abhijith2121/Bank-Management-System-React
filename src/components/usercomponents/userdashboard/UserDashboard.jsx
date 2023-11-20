import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './UserDashboard.css'
import { jwtDecode } from "jwt-decode";



function UserDashboard() {

  const [username, setUsername] = useState('');
  useEffect(() => {
    const authTokens = JSON.parse(localStorage.getItem('authTokens'));

    if (authTokens && authTokens.access_token) {
      const decodedToken = jwtDecode(authTokens.access_token);
      const username = decodedToken.username;
      setUsername(username);
    } else {
      console.log("No token");
    }
  }, []);



  const signOut = () => {
    console.log("Bye");
  }
  return (
    <div className='bg-dark m-4 pt-6'>
      <div className='bg-light'><h1 className='bg-light'>Dashboard</h1>
        <h2> Hi {username} </h2></div>
      <Link to='/createaccount'><button className='btn btn-primary p-2 m-2'> Create Account</button></Link>
      <Link to='/accountlogin'><button className='btn btn-primary p-2 m-2'>Already have a Account</button></Link>
      <Link onClick={signOut}><button className='btn btn-primary p-2 m-2'>Signout</button> </Link>
    </div>
  )
}

export default UserDashboard
