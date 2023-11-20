import React, { useState,useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './admindashboard.css'
import { Link } from 'react-router-dom'
import { list,deleteUserAccount,pagination,searchbyName } from '../../../services/ApiServices';
import { FaTrash } from 'react-icons/fa';
import { Button } from 'react-bootstrap';
import SearchBox from '../../searchbox/SearchBox';

function AdminDashboard() {
    const [users, setUsers] = useState([])
    const [message,setMessage]=useState('')
    const [nextLink, setNextLink] = useState('');
    const [previousLink, setPreviousLink] = useState('');
    const [originalUsers, setOriginalUsers] = useState([]);
    const [search, setSearch] = useState('')
   
  
    useEffect(() => {
        const fetchData = async () => {

            try {
                const response = await list('adminlist/');
                const usersListResponse = response.data;
                console.log("From AdminDashboard component " + usersListResponse);
                setUsers(usersListResponse.results);
                setOriginalUsers(usersListResponse.results);
                setNextLink(response.data.next);
                setPreviousLink(response.data.previous);
            } catch (error) {
                console.log('An error occurred:', error);
                setMessage(error);       
            }
        };
        fetchData();
    }, []);

    const handlePages=async(url)=>{
        try{
          const response=await pagination(url)
          setUsers(response.data.results) 
          console.log("pagiantion"+response.data.next)
          console.log("pagination"+response.data.previous)
          setNextLink(response.data.next);
          setPreviousLink(response.data.previous);
        }catch (error) {
          console.log('An error occurred:', error);
          setMessage(error);
          const timeoutId = setTimeout(() => {
            setMessage('');
          }, 2000);
        }
      }
  
    const handleDelete=async(id)=>{
        const updatedUsers = users.filter((user) => user.id !== id);
        setUsers([...updatedUsers]); 
        try{
            const response=await deleteUserAccount(id);
            if(response.data.message==="User deleted successfully"){
                setMessage(response.data.message)
            }else if(response.data.message==="User id is required"){
                setMessage(response.data.message)
            }else if(response.data.message==="User not found"){
                setMessage(response.data.message)
            }
            const timeoutId = setTimeout(() => {
                setMessage('');
              }, 2000);
        }catch(error){
            alert("User Registration failed: " + error.message);
        }
    }

    const handleSearchApi=async(name)=>{
        try{
          const response = await searchbyName(`/searchusers/?search=${name}`);
       
          setUsers(response.data);
        }catch (error) {
          setMessage(error);
        }
        
      }
    return (
        <>
         {message && <div className={`alert ${message === 'User deleted successfully' ? 'alert-success' : 'alert-danger'}`}>{message}</div>}
            <div className='adduser-button s'>
                <Link to='/adduser'><Button type="button" variant='success'>Add User</Button></Link>
            </div>

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
                            <FaTrash className="trash-icon" onClick={()=>handleDelete(user.id)} /> 
                        </td>
                    
                            
                        
                    </tr>
                ))}
                </tbody>
            </table>
            <div>
        {previousLink && <Button variant="primary" className="mx-2" onClick={() => handlePages(previousLink)}>Previous</Button>}
        {nextLink && <Button variant="primary" className="mx-2" onClick={() => handlePages(nextLink)}>Next</Button>}
      </div>
        </>
    );
}

export default AdminDashboard;
