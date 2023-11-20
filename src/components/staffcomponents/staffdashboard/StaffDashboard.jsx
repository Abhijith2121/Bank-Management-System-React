import React, { useState, useEffect } from 'react';
import {list, openAccount,closeAccount,pagination,searchbyName} from '../../../services/ApiServices';
import SearchBox from '../../searchbox/SearchBox'
import './staffdashboard.css'
import { Button } from 'react-bootstrap';
import { AiOutlineFilter } from 'react-icons/ai';
import { MdFilterList } from 'react-icons/md';

function StaffDashboard() {
  const [accounts, setAccounts] = useState([]);
  const [message, setMessage] = useState('');
  const [nextLink, setNextLink] = useState('');
  const [previousLink, setPreviousLink] = useState('');
  const [search,setSearch] = useState('')
  const [originalAccounts, setOriginalAccounts] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc')

  const disappear=(time)=>{
    setTimeout(() => {
        setMessage('');
      }, time);
}


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await list('accountdetails/');
        setAccounts(response.data.results);
        setOriginalAccounts(response.data.results);
        setNextLink(response.data.next);
        setPreviousLink(response.data.previous);
      } catch (error) {
        setMessage(error);
      }
    };

    fetchData();
  }, []);

  useEffect(()=>{
    sortAccounts()
  },[sortOrder])

 const sortAccounts=()=>{
  const sortedAccounts = [...accounts].sort((a,b)=>{

    const statusA = a.status.toLowerCase()
    const statusB = b.status.toLowerCase()

    if(statusA === statusB){
      return 0
    }

    if(sortOrder === 'asc'){
      return statusA === 'active' ? -1 : 1
    }else{
      return statusA === 'pending' ? -1 :1
    }
  })
  setAccounts(sortedAccounts)
 }

 const handleSort = () => {
  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  
}

  const handlePages=async(url)=>{
    try{
      const response=await pagination(url)
      setAccounts(response.data.results) 
      setNextLink(response.data.next);
      setPreviousLink(response.data.previous);
    }catch (error) {
      setMessage(error);
    }
  }

  const handleOpenAccount = async (accountNumber) => {
    try {
      const response = await openAccount(accountNumber);
      setMessage(response.data.message);
      disappear(2000)
      setAccounts((prevAccounts) =>
        prevAccounts.map((account) =>
          account.account_number === accountNumber
            ? { ...account, status: "active" }
            : account
        )
      );
    } catch (error) {
      setMessage(error);
    }
  };
  
  const handleCloseAccount = async (accountNumber) => {
    try {
      const response = await closeAccount(accountNumber);
      setMessage(response.data.message);
      disappear(2000)
      setAccounts((prevAccounts) =>
        prevAccounts.map((account) =>
          account.account_number === accountNumber
            ? { ...account, status: "pending" }
            : account
        )
      );
    } catch (error) {
      setMessage(error);
    }
  };

  const handleSearchApi=async(name)=>{
    try{
      const response = await searchbyName(`/searchaccount/?search=${name}`);
      const staffListResponse = response.data.results;
      setAccounts(staffListResponse);
    }catch (error) {
      setMessage(error);
      disappear(2000)
    }
    
  }
  
  

  return (
    <>
      {message && (
        <div className={`alert ${(message === 'Account is now active' ||message === 'Account is now in pending state')  ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}
      <div className='filter'>
        Filter
      <a onClick={handleSort} ><MdFilterList className="filter-icon" /></a>
      </div>
      
        
      
      <SearchBox search={search}
                 setSearch={setSearch} 
                //  handleSearch={handleSearch}
                 accounts={accounts}
                 setAccounts={setAccounts}
                 originalAccounts={originalAccounts}
                 handleSearchApi={handleSearchApi}/>

      <div className="table container">
      <table className="table container" style={{ "marginTop": "100px" }}>
        <thead>
          <tr>
            <th scope="col">Sl:No</th>
            <th scope="col">Account Name</th>
            <th scope="col">Account Number</th>
            <th scope="col">Status</th>
            <th scope="col">User Name</th>
            <th scope="col" className="custom-margin-left">Change Status</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account, index) => (
            <tr key={account.id}>
              <th scope="row">{index + 1}</th>
              <td>{account.account_name}</td>
              <td>{account.account_number}</td>
              <td>
                {account.status === "active" ? (
                  <span className="text-success">Activate</span>
                ) : (
                  <span className="text-danger">{account.status}</span>
                )}
              </td>
              <td>{account.customer.username}</td>
              <td>
                {account.status !== "active" ? (
                  <Button variant='success'  onClick={() => handleOpenAccount(account.account_number)}>
                    open
                  </Button>
                ) : (
                  <Button variant='danger' onClick={() => handleCloseAccount(account.account_number)}>
                    close
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      </div>
      <div>
        {previousLink && <Button variant="primary" className="mx-2" onClick={() => handlePages(previousLink)}>Previous</Button>}
        {nextLink && <Button variant="primary" className="mx-2" onClick={() => handlePages(nextLink)}>Next</Button>}
      </div>
    </>
  );
}

export default StaffDashboard;
