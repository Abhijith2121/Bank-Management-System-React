import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './userlist.css'
import { list,pagination,searchbyName } from '../../../services/ApiServices';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SearchBox from '../../searchbox/SearchBox';

function UserList() {
  const [users, setUsers] = useState([])
  const [message, setMessage] = useState('')
  const [nextLink, setNextLink] = useState('');
  const [previousLink, setPreviousLink] = useState('');
  const [originalUsers, setOriginalUsers] = useState([]);
  const [search, setSearch] = useState('')
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await list('customers/');
        const usersListResponse = response.data.results;
        setUsers(usersListResponse);
        setOriginalUsers(usersListResponse)
        setNextLink(response.data.next);
        setPreviousLink(response.data.previous);
      } catch (error) {
        setMessage(error);
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
      setMessage(error.message);
    }
  }


  const handleSearchApi=async(name)=>{
    try{
      const response = await searchbyName(`/searchuser/?search=${name}`);
      const staffListResponse = response.data.results;
      setUsers(staffListResponse);
    }catch (error) {
      setMessage(error.message);
    }
    
  }
  return (
    <>
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
            <th scope="col" class="custom-margin-left">Update</th>
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
              <Link to={`/updateuser/${user.id}`}><Button variant="primary">Update</Button></Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {previousLink && <Button variant="primary" className="mx-2" onClick={() => handlePages(previousLink)}>Previous</Button>}
        {nextLink && <Button variant="primary" role='button' className="mx-2 fortext" onClick={() => handlePages(nextLink)}>Next</Button>}
      </div>
    </>
  );
}

export default UserList;
