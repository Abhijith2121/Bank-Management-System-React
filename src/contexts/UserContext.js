import { createContext,useContext } from "react";
import { jwtDecode } from "jwt-decode";


const UserContext=createContext();

export const useUserContext=()=>{
    return useContext(UserContext)
}

export const UserProvider=({children})=>{
    const authTokens=JSON.parse(localStorage.getItem('authTokens'));
    const initialUserState = {
        userName: '',
        accountName: '',
        isAuthenticated: false,
      };
    if (authTokens && authTokens.access_token) {
        const decodedToken = jwtDecode(authTokens.access_token);
        initialUserState.userName = decodedToken.username;
        initialUserState.accountName = decodedToken.account_name;
        initialUserState.isAuthenticated = true;
        
      } else {
        console.log("No token");
      }
   return(
    <UserContext.Provider value={{userState:initialUserState}}>
        {children}
    </UserContext.Provider>
   )
}