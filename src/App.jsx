import React, { useEffect, useState } from 'react'
import LoginPage from './components/LoginPage';
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authStatus === 'true');
  }, []);

  // Mock current route detection (in real app, use useLocation)
  // const getCurrentRoute = () => {
  //   // In real app, this would come from useLocation()
  //   return isAuthenticated ? '/dashboard' : '/';
  // };

  // const currentRoute = getCurrentRoute();

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
              <Dashboard /> : 
              <LoginPage />
          } 
        />
        
        {/* Protected Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ?
              <Dashboard /> : 
              <LoginPage />
          } 
        />
      </Routes>
      
     
    </Router>
  );
};

export default App;