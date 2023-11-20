module.exports = {
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>image-mock.js'
    },
    testEnvironment: "jsdom",
    coveragePathIgnorePatterns: [
      "bank/src/interceptor/Interceptor.jsx",
      "bank/src/services/ApiServices.jsx",
      "bank/src/contexts/AuthContext.js",
      "bank/src/contexts/UserContext.js",
      "bank/src/routers/ProtectedRouters.jsx",
      "bank/src/routers/Router.jsx"
      
    ],
   
    
    
    
    
   
  };
  