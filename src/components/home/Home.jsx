import React from 'react'
import { Link } from 'react-router-dom'
import './home.css'
function Home() {
  
  return (
    <div>
   <section id="hero" class="d-flex align-items-center">
    <div class=" title d-flex flex-column align-items-center" data-aos="zoom-in" data-aos-delay="100">
      <h1 className=' text-white'> Bank Management System</h1>
      
      <Link to={'/login'}><a class="btn-about">User SignIn</a></Link>
      <Link to={'/admin'}><a class="btn-about">Admin SignIn</a></Link>
    </div>
  </section>
       </div>
  )
}

export default Home
