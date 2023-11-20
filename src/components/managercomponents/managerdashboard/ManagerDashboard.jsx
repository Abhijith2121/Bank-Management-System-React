import React from 'react'
import './managerdashboard.css'
import { Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function ManagerDashboard() {
  return (
    <section id="hero-animated" class="hero-animated d-flex align-items-center">
      <div class="container d-flex flex-column justify-content-center align-items-center text-center position-relative" data-aos="zoom-out">

        <h2>Manager<span>panel</span></h2>

        <div class="d-flex">
         <Link to='/staffs'><Button variant="primary" className="mx-2" >Staffs</Button></Link> 
         <Link to='/users'><Button variant="primary" className="mx-2" >Customers</Button></Link>
        </div>
      </div>
    </section>
  )
}

export default ManagerDashboard