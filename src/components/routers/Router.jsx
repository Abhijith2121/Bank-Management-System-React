import React from 'react'
import { useRoutes } from 'react-router-dom'
import UserSignup from '../userauthentication/UserSignup'
import UserLogin from '../userauthentication/UserLogin'
import Common from '../common/Common'
import CreateAccount from '../createaccount/CreateAccount'
import DepositForm from '../depositform/DepositForm'
import WithdrawForm from '../withdrawform/WithdrawForm'
import Transactions from '../transactions/Transaction'
import Adminlogin from '../admincomponents/adminlogin/AdminLogin'
import AdminDashboard from '../admincomponents/admindashboard/AdminDashboard'
import AddUserForm from '../admincomponents/adminadduser/AddUserForm'
import UserDashboard from '../usercomponents/userdashboard/UserDashboard'
import UserBankServices from '../usercomponents/userdashboard/userbankservices/UserBankServices'
import {ProtectedRoute,AdminProtectedRoute, StaffProtectedRoute, ManagerProtectedRoute} from './ProtectedRouters'
import StaffDashboard from '../staffcomponents/staffdashboard/StaffDashboard'
import ManagerDashboard from '../managercomponents/managerdashboard/ManagerDashboard'
import StaffList from '../managercomponents/stafflist/StaffList'
import UserList from '../managercomponents/userlist/UserList'
import UpdateUser from '../managercomponents/updateuser/UpdateUser'
import AccountLogin from '../accountlogin/AccountLogin'
import Home from '../home/Home'
import ForgetPassword from '../forgetpassword/ForgetPassword'


function Router() {

  let element = useRoutes([
    {
      element: <Common/>,
      children: [
        {
          path:'/',element:<Home/>
        },
        {
          path: "/signup", element: <UserSignup/>,
        },
        {
          path: '/login', element: <UserLogin/>
        },
        {
          path:'/createaccount',element:<ProtectedRoute><CreateAccount/></ProtectedRoute>
        },
        {
          path:'/deposit',element:<ProtectedRoute><DepositForm/></ProtectedRoute>
        },
        {
          path:'/withdraw',element:<ProtectedRoute><WithdrawForm/></ProtectedRoute>
        },
        {
          path:'/transactions',element:<ProtectedRoute><Transactions/></ProtectedRoute>
        },
        {
          path:'/admin',element:<Adminlogin/>
        },
        {
          path:'/admindashboard',element:<AdminProtectedRoute><AdminDashboard/></AdminProtectedRoute>
        },
        {
          path:'/adduser',element:<AdminProtectedRoute><AddUserForm/></AdminProtectedRoute>
        },
        {
          path:'/userdashboard',element:<ProtectedRoute><UserDashboard/></ProtectedRoute>
        },
        {
          path:'/bankservices',element:<ProtectedRoute><UserBankServices/></ProtectedRoute>
        },
        {
          path:'/staffdashboard',element:<StaffProtectedRoute><StaffDashboard/></StaffProtectedRoute>
        },
        {
          path:'/managerdashboard',element:<ManagerProtectedRoute><ManagerDashboard/></ManagerProtectedRoute>
        },
        {
          path:'/staffs',element:<ManagerProtectedRoute><StaffList/></ManagerProtectedRoute>
        },
        {
          path:'/users',element:<ManagerProtectedRoute><UserList/></ManagerProtectedRoute>
        },
        {
          path:'/updateuser/:userId',element:<ManagerProtectedRoute><UpdateUser/></ManagerProtectedRoute>
        },
        {
          path:'/accountlogin',element:<ProtectedRoute><AccountLogin/></ProtectedRoute>
        },
        {
          path:'/forgetpassword',element:<ForgetPassword/>
        }
        
      ]
    }
  ])
  return (
    element
  )
}

export default Router