import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthContext from '../config/context/auth-context';
import AdminLayout from '../module/admin/AdminLayout';
import Main from '../module/admin/Main';
import Products from '../module/admin/Products';
import SignIn from '../module/auth/SignIn';
import ForgotPassword from '../module/auth/ForgotPassword';
import ResetPassword from '../module/auth/ResetPassword';
import CreateUser from '../module/auth/CreateUser';
import NotFound404 from '../module/auth/NotFound404';
import InternalServerError500 from '../module/auth/InternalServerError500';
import Forbidden403 from '../module/auth/Forbidden403';
import Binnacle from '../module/admin/Binnacle';
import Categories from '../module/admin/Categories';
import Users from '../module/admin/Users';
import Sales from '../module/admin/Sales';
import NewSalesWrapper from '../module/admin/NewSalesWraper';
import NewSalesWrapperU from '../module/user/NewSalesWrapperU';
import UserLayout from '../module/user/UserLayout';
import ProductsU from '../module/user/ProductsU';
import Logo from '../assets/icon.svg';

const ResetPasswordGuard = ({ children }) => {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('resetToken') : null;
  if (!token) {
    return <Navigate to="/forgot-password" replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const { user: state } = useContext(AuthContext);
  const rawUser = localStorage.getItem('user');
  const localUser = rawUser ? JSON.parse(rawUser) : null;
  const token = localUser?.token || localStorage.getItem('token');
  const role = localUser?.user?.rol || state?.user?.rol || null;

  console.log('PublicRoute: ', { token, role, state });

  if (token && role) {
    return role === 'ADMIN_ROLE' ? (
      <Navigate to="/admin" replace />
    ) : role === 'USER_ROLE' ? (
      <Navigate to="/user" replace />
    ) : (
      <Navigate to="/sign-in" replace />
    );
  }

  return children;
};

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user: state } = useContext(AuthContext);
  const rawUser = localStorage.getItem('user');
  const localUser = rawUser ? JSON.parse(rawUser) : null;
  const token = localUser?.token || localStorage.getItem('token');
  const role = localUser?.user?.rol || state?.user?.rol || null;

  console.log('ProtectedRoute: ', { token, role, allowedRole, state });

  if (!token) {
    return <Navigate to="/sign-in" replace />;
  }

  if (!role || role !== allowedRole) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

const AppRouter = () => {
  const { user: state, dispatch } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const rawUser = localStorage.getItem('user');
    const localUser = rawUser ? JSON.parse(rawUser) : null;
    const token = localUser?.token || localStorage.getItem('token');
    const userRole = localUser?.user?.rol || state?.user?.rol || null;
    console.log('AppRouter useEffect: ', { token, rawUser, localUser, userRole, state });
    setRole(userRole);
    setIsLoading(false);
  }, [state]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="relative">
          <div className="loader2"></div>
          <img
            src={Logo}
            alt="logo"
            className="w-20 h-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/sign-in"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ResetPasswordGuard>
              <ResetPassword />
            </ResetPasswordGuard>
          }
        />
        <Route
          path="/create-user"
          element={
            <PublicRoute>
              <CreateUser />
            </PublicRoute>
          }
        />
        <Route path="/500" element={<InternalServerError500 />} />
        <Route path="/403" element={<Forbidden403 />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="ADMIN_ROLE">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Main />} />
          <Route path="users" element={<Users />} />
          <Route path="categories" element={<Categories />} />
          <Route path="products" element={<Products />} />
          <Route path="sales" element={<Sales />} />
          <Route path="log" element={<Binnacle />} />
          <Route path="new-sale" element={<NewSalesWrapper />} />
        </Route>

        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRole="USER_ROLE">
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProductsU />} />
          <Route path="new-sale" element={<NewSalesWrapperU />} />
        </Route>

        <Route
          path="/"
          element={
            role === 'ADMIN_ROLE' ? (
              <Navigate to="/admin" replace />
            ) : role === 'USER_ROLE' ? (
              <Navigate to="/user" replace />
            ) : (
              <Navigate to="/sign-in" replace />
            )
          }
        />

        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;