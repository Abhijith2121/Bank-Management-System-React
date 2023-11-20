import React, { useState,useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './stafflist.css'
import {  list } from '../../../services/ApiServices';
import { Button } from 'react-bootstrap';
import { staffAllow ,pagination,searchbyName} from '../../../services/ApiServices';
import SearchBox from '../../searchbox/SearchBox';

function StaffList() {
    const [users, setUsers] = useState([])
    const [message,setMessage]=useState('')
    const [nextLink, setNextLink] = useState('');
    const [previousLink, setPreviousLink] = useState('');
    const [originalUsers, setOriginalUsers] = useState([]);
    const [search, setSearch] = useState('')

    const disappear=(time)=>{
      const timeoutId = setTimeout(() => {
          setMessage('');
        }, time);
  }
  
    useEffect(() => {
        const fetchData = async () => {

            try {
                const response = await list('staffs/');
                const usersListResponse = response.data.results;
                setUsers(usersListResponse);
                setOriginalUsers(usersListResponse)
                setNextLink(response.data.next);
                setPreviousLink(response.data.previous);
            } catch (error) {
                setMessage(error);
                disappear(2000)
            }

        };

        fetchData();
    }, []);

    const handlePages=async(url)=>{
      try{
        const response=await pagination(url)
        setUsers(response.data.results) 
        setNextLink(response.data.next);
        setPreviousLink(response.data.previous);
      }catch (error) {
        setMessage(error);
        disappear(2000)
      }
    }

    const handleStaffAllow = async (id) => {
      const data={
        status:"allowed"
       
     }
      const updatedUser = users.map((user) =>
      user.id === id ? { ...user, status: "allowed" } : user);
        setUsers(updatedUser);
      try {
        const response = await staffAllow(id,data)
        setMessage(response.data.message);
      } catch (error) {
        setMessage(error);
        disappear(2000)
      }
    };

    const handleStaffNotAllow = async (id) => {
      const data={
        status:"not allowed"
       
     }
      const updatedUser = users.map((user) =>
      user.id === id ? { ...user, status: "not allowed" } : user);
        setUsers(updatedUser);
      try {
        const response = await staffAllow(id,data)
        setMessage(response.data.message);
      } catch (error) {
        setMessage(error);
        disappear(2000)
      }
    };


  const handleSearchApi=async(name)=>{
    try{
      const response = await searchbyName(`/searchstaff/?search=${name}`);
      const staffListResponse = response.data.results;
      setUsers(staffListResponse);
    }catch (error) {
      setMessage(error);
      disappear(2000)
    }
    
  }
   
    return (
        <>
         {message && <div className={`alert ${message === 'User details updated successfully' ? 'alert-success' : 'alert-danger'}`}>{message}</div>}
            
         <SearchBox search={search}
                 setSearch={setSearch} 
                 users={users}
                 setUsers={setUsers}
                 originalUsers={originalUsers}
                 handleSearchApi={handleSearchApi}/>


            <table className="table container" style={{ "marginTop": "100px" }}>

                <thead>
                    <tr>
                        <th scope="col">Sl:No</th>
                        <th scope="col">User Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">User Type</th>
                        <th scope="col">User Position</th>
                        <th scope="col">Status</th>
                        <th scope="col" class="custom-margin-left">Clear</th>
                    </tr>
                </thead>
                <tbody>
                {users.map((user, index) => (
                    <tr key={user.id}>
                        <th scope="row">{index + 1}</th>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.user_type}</td>
                        <td>{user.user_position}</td>
                        <td>{user.status}</td>
                       
                        <td>
                {user.status !== "allowed" ? (
                   <Button variant="danger" onClick={()=>{handleStaffAllow(user.id)}}>Allow</Button>
                ) : (
                  <Button variant="success" onClick={()=>{handleStaffNotAllow(user.id)}}> Allowed</Button>
                   
                  
                )}
              </td>
                              
                        
                    </tr>
                ))}
                </tbody>
            </table>
            <div>
        {previousLink && <Button variant="primary" className="mx-2 previouspage" onClick={() => handlePages(previousLink)}>Previous</Button>}
        {nextLink && <Button variant="primary" className="mx-2 nextpage" onClick={() => handlePages(nextLink)}>Next</Button>}
      </div>
        </>
    );
}

export default StaffList;
