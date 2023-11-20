import axios from "axios";

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT;
const axiosInstance = axios.create({
  baseURL: apiEndpoint,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const authTokens = JSON.parse(localStorage.getItem('authTokens'));
    const adminAuthTokens = JSON.parse(localStorage.getItem('adminAuthTokens'));
    const token = authTokens?.access_token;
    const adminToken=adminAuthTokens?.access_token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log("Config" + config.headers)
      console.log("Frpm interceptor"+ token);
    }
    if (adminToken) {
      config.headers['Authorization'] = `Bearer ${adminToken}`;
      console.log("Config" + config.headers)
      console.log("Frpm interceptor"+ token);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401) {
      const firstMessage = error.response.data.messages[0];
      console.log(firstMessage);
      if (firstMessage.token_class === 'AccessToken' && firstMessage.message === 'Token is invalid or expired') {
        const accessToken = await refreshAccessToken();
        axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
        return axiosInstance(originalRequest);
      } else if (firstMessage.token_class === 'RefreshToken' && firstMessage.message === 'Token is invalid or expired') {
        handleRefreshTokenFailure();
      }
    } else if (error.response && (error.response.status === 400 || error.response.status === 404) || error.response.status === 500) {
      console.log('Received a', error.response.status, 'status code:', error.response.status);
      console.log('Error response data:', error.response.data);
     
      return Promise.reject(error);
    } else {
      
      console.error('Unhandled error:', error);
      return Promise.reject(error);
    }
  }
);

const refreshAccessToken = async () => {
  const authTokens = JSON.parse(localStorage.getItem('authTokens'));
  const refreshToken = authTokens.refresh_token;
  const data = { "refresh": refreshToken };
  try {
    const response = await axios.post(`${apiEndpoint}api/token/refresh/`, data);
    const accessToken = response.data.access;
    let newAuthTokens = JSON.stringify({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    localStorage.setItem('authTokens', newAuthTokens);
    return accessToken;
  } catch (err) {
    console.log('Error occurred in generating refresh token: ', err);
    handleRefreshTokenFailure();
  }
};

const handleRefreshTokenFailure = () => {
  localStorage.clear();
  window.location.replace('/login');
};

const axiosPrivate = axiosInstance;
export { axiosPrivate,axiosInstance };
