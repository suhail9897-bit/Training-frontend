import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';



const App = () => {
   return (
    <Routes>
  <Route path="/login" element={<Login />} />

  <Route
    path="/admin-dashboard"
    element={
      <ProtectedRoute allowedRole="admin">
        <AdminDashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/candidate-dashboard"
    element={
      <ProtectedRoute allowedRole="candidate">
        <CandidateDashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/"
    element={
      localStorage.getItem("role") === "admin" ? (
        <Navigate to="/admin-dashboard" replace />
      ) : localStorage.getItem("role") === "candidate" ? (
        <Navigate to="/candidate-dashboard" replace />
      ) : (
        <Navigate to="/login" replace />
      )
    }
  />
</Routes>

  );
};

export default App;
