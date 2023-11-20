import React from 'react'
import './UserBankServices.css'
import { Link } from 'react-router-dom';

function UserBankServices() {
    
  return (
    <div>
       <section id="services" class="services section-bg">
      <div class="container" data-aos="fade-up">

        <div class="section-title">
          <h2>Services</h2>
        
        </div>

        <div class="row">
          <div class="col-xl-3 col-md-6 d-flex align-items-stretch serv" data-aos="zoom-in" data-aos-delay="100">
            <div class="icon-box">
             
              <Link color='black' to='/deposit'><h4>Deposit</h4></Link>
 
              
            </div>
          </div>

          <div class="col-xl-3 col-md-6 d-flex align-items-stretch mt-4 mt-md-0" data-aos="zoom-in" data-aos-delay="200">
            <div class="icon-box">
             
            <Link color='black' to='/withdraw'><h4>Withdraw</h4></Link>
              
            </div>
          </div>


          <div class="col-xl-3 col-md-6 d-flex align-items-stretch mt-4 mt-md-0" data-aos="zoom-in" data-aos-delay="200">
            <div class="icon-box">
             
            <Link color='black' to='/transactions'><h4>Transaction History</h4></Link>
              
            </div>
          </div>

         


         
        
        </div>

      </div>
    </section>
    
    </div>
  )
}

export default UserBankServices
