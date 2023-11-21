import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { transactionsHistory, downloadTransaction,deleteTransaction } from '../../services/ApiServices';
import { jwtDecode } from "jwt-decode";
import { FaTrash } from 'react-icons/fa';

function Transaction() {
    const [transactions, setTransactions] = useState([]);
    const [accountNumber, setAccountNumber] = useState('');
    const [message, setMessage] = useState('');

    const disappear=(time)=>{
        setTimeout(() => {
            setMessage('');
          }, time);
    }

    useEffect(() => {
        const fetchData = async () => {
            const authTokens = JSON.parse(localStorage.getItem('authTokens'));
            const accountNumber1=authTokens?.access_token && jwtDecode(authTokens.access_token)?.account_number
              setAccountNumber(accountNumber1);  
               accountNumber1 && (async () => {
                try {
                  const response = await transactionsHistory({ account_number: accountNumber1 });
                  setTransactions(response.data.transactions);
                } catch (error) {
                  setMessage(error.message);
                  disappear(2000);
                }
              })();
        }

        fetchData();
    }, []);

    const handleDownloadTransaction = async () => {
        const data = {
            account_number: accountNumber
        }
        try {
            const response = await downloadTransaction(data)
            setMessage(response.data.message)
        } catch (error) {
           setMessage(error.message)
           disappear(2000)
        }
    }
    const handleDeleteTransaction=async(id)=>{
        const updatedTransactions=transactions.filter((transaction)=>transaction.id!=id)
        setTransactions([...updatedTransactions])
        try{
            const response=await deleteTransaction(id)
            setMessage(response.data.message)
            disappear(2000)
        }catch (error){
            setMessage(error.message)
           disappear(2000)
        }
    }
return (
    <>
     {message && <div className={`alert ${message === 'Transaction data saved successfully' ? 'alert-success' : 'alert-danger'}`}>{message}</div>}
    <table className="table container" style={{ "marginTop": "100px" }}>
        <thead>
            <tr>
                <th scope="col">Sl:No</th>
                <th scope="col">Transaction Type</th>
                <th scope="col">Amount</th>
                <th scope="col">Created At</th>
                <th scope="col" class="custom-margin-left">Clear</th>
            </tr>
        </thead>
        <tbody>

            {transactions.map((transaction, index) => (
                (transaction.isDeleted === false) ? (
                <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td role='cell'>{transaction.amount}</td>
                    <td data-testid="transaction-type-cell">{transaction.transaction_type}</td>
                    <td>{transaction.created_at}</td>
                   {
                    (transaction.isDeleted === false) ? ( <td>
                    <FaTrash role='img' name='Delete' className="trash-icon" data-testid="delete" onClick={()=>handleDeleteTransaction(transaction.id)}/> 
                </td>):null
                   } 
                   
                </tr>
            ):null ))}
        </tbody>
        <a className="btn btn-sm btn-danger custom-small-button" onClick={handleDownloadTransaction}>
                            Download
                     </a>
    </table>
    </>
);
 }

export default Transaction;
