import axios from "axios";
import { axiosPrivate } from "../interceptor/Interceptor";

const createAccount = (data) => {
  try{
    const response=axiosPrivate.post('createaccount/', data)
    return response
  }catch(error){
    if (error.response) {
      const errorMessage = error.response.data.message;
      throw errorMessage;
    } else {
      throw error;
    }
  }
}


const accountLogin = (data) => {
  try{
    const response=axiosPrivate.post('account/login/', data)
    return response
  }catch(error){
    if (error.response) {
      const errorMessage = error.response.data.message;
      throw errorMessage;
    } else {
      throw error;
    }
  }
}


const deposit = async (data) => {
  try {
    const response = await axiosPrivate.post('deposit/', data);
    return response;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      const errorMessage = error.response.data.message;
      throw errorMessage;
    } else {
      throw error;
    }
  }
}

const withdraw = async (data) => {
  try {
    const response = await axiosPrivate.post('withdraw/', data);
    return response;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      const errorMessage = error.response.data.message;
      throw errorMessage;
    } else {
      throw error;
    }
  }
};

const transactionsHistory = async (data) => {
  try {
    const response = await axiosPrivate.post('transactions/', data);
    return response;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      const errorMessage = error.response.data.message;
      throw errorMessage;
    } else {
      throw error;
    }
  }
}

const adminLogin = async (data) => {
  try {
    const response = await axiosPrivate.post('adminlogin/', data);
    return response;
  } catch (error) {
    if (error.response) {
      const errorMessage = error.response.data.message;
      throw errorMessage;
    } else {
      throw error;
    }
  }
}
const deleteUserAccount = async (id) => {
  try {
    const response = await axiosPrivate.delete(`admindelete/${id}/`);
    return response;
  } catch (error) {

    const errorMessage = error.response.data.message;
    throw errorMessage;

  }
};

const addUserAccount = async (data) => {
  console.log("Add user service is called")
  try {
    const response = await axiosPrivate.post('add-user/', data)
    console.log("response" + response)
    return response;
  } catch (error) {
    const errorMessage = error.response.data.message;
    throw errorMessage;
  }
}


const openAccount = async (accountNumber) => {
  try {
    const response = await axiosPrivate.put(`staff/accountdetails/${accountNumber}/activate/`);
    return response;
  } catch (error) {

    const errorMessage = error.response.data.message;
    throw errorMessage;
  }
}

const closeAccount = async (accountNumber) => {
  try {
    const response = await axiosPrivate.put(`staff/accountdetails/${accountNumber}/diactivate/`);
    return response;
  } catch (error) {

    const errorMessage = error.response.data.message;
    throw errorMessage;
  }
}

const list = async (url) => {
  try {
    const response = await axiosPrivate.get(url);

    return response;
  } catch (error) {
    if (error.response) {
      const errorMessage = error.response.data.message;
      throw errorMessage;
    } else {
      throw error;
    }
  }
}

const staffAllow = async (id,data) => {
  try {
    const response = await axiosPrivate.put(`manager/${id}/allowstaff/`,data);
    return response;
  } catch (error) {

    const errorMessage = error.response.data.message;
    throw errorMessage;
  }
}

const userDetail = async (id) => {
  try {
    const response = await axiosPrivate.get(`users/${id}/`);
    return response;
  } catch (error) {

    const errorMessage = error.response.data.message;
    throw errorMessage;
  }
}
const userDetailUpdate= async (id,data) => {
  try {
    const response = await axiosPrivate.put(`manager/${id}/updateuser/`,data);
    return response;
  } catch (error) {

    const errorMessage = error.response.data.message;
    throw errorMessage;
  }
}

const pagination=async(url)=>{
  try{
    const response=await axiosPrivate.get(url);
    return response;
  }catch (error) {

    const errorMessage = error.response.data.message;
    throw errorMessage;
  }
}

const forgetPassword=async(data)=>{
  try{
    const response=await axiosPrivate.post('reset-password/',data)
    return response;
  }catch (error) {

    const errorMessage = error.response.data.message;
    throw errorMessage;
  }
}

const downloadTransaction=async(data)=>{
  try{
    const response=await axiosPrivate.post('savetransaction/',data)
    return response
  }catch (error) {
    const errorMessage = error.response.data.message;
    throw errorMessage;
  }
}

const searchbyName=async(url)=>{
  try{
    const response=await axiosPrivate.get(url)
    return response
  }catch(error){
    const errorMessage = error.response.data.message;
    throw errorMessage;
  }
}

const deleteTransaction=async(id)=>{
  try{
    const response=await axiosPrivate.delete(`deletetransaction/${id}`)
    return response
  }catch(error){
    const errorMessage = error.response.data.message;
    throw errorMessage 
  }
}


export {
  createAccount,
  accountLogin,
  deposit,
  withdraw,
  transactionsHistory,
  adminLogin,
  deleteUserAccount,
  addUserAccount,
  openAccount,
  closeAccount,
  list,
  staffAllow,
  userDetail,
  userDetailUpdate,
  pagination,
  forgetPassword,
  downloadTransaction,
  searchbyName,
  deleteTransaction
}