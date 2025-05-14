import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';



const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
