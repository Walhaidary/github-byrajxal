import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import ResetPasswordForm from './components/auth/ResetPasswordForm';
import DashboardLayout from './components/layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import NewService from './pages/NewService';
import ValidateService from './pages/ValidateService';
import ViewServiceReceipt from './pages/ViewServiceReceipt';
import Administration from './pages/Administration';
import AuthLayout from './components/layouts/AuthLayout';
import PrivateRoute from './components/auth/PrivateRoute';
import PermissionGuard from './components/auth/PermissionGuard';
import { AdminRoute } from './components/auth/AdminRoute';

export default function App() {
  console.log('App rendering'); // Debug log

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route element={<AuthLayout />}>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/signup" element={<SignupForm />} />
                <Route path="/forgot-password" element={<ResetPasswordForm />} />
              </Route>

              {/* Protected routes */}
              <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
                <Route index element={
                  <PermissionGuard requiredPermission="new_service.read">
                    <Dashboard />
                  </PermissionGuard>
                } />
                
                <Route path="new-service" element={
                  <PermissionGuard requiredPermission="new_service.read">
                    <NewService />
                  </PermissionGuard>
                } />
                
                <Route path="validate-service" element={
                  <PermissionGuard requiredPermission="validate_service.read">
                    <ValidateService />
                  </PermissionGuard>
                } />
                
                <Route path="receipt/:id" element={
                  <PermissionGuard requiredPermission="validate_service.read">
                    <ViewServiceReceipt />
                  </PermissionGuard>
                } />
                
                <Route path="admin" element={
                  <PermissionGuard requiredPermission="admin.read">
                    <AdminRoute>
                      <Administration />
                    </AdminRoute>
                  </PermissionGuard>
                } />
              </Route>

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </div>
    </ErrorBoundary>
  );
}