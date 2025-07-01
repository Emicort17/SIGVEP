import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../config/context/auth-context';
import SignIn from '../module/auth/SignIn';
import ForgotPassword from '../module/auth/ForgotPassword';
import ResetPassword from '../module/auth/ResetPassword';
import CreateUser from '../module/auth/CreateUser';

const AppRouter = () => {
    const { user } = useContext(AuthContext);

    const getRole = () => {
        if (user?.usuario?.rol.rol === "ADMIN") {
            return "ADMIN";
        } else if (user?.usuario?.rol.rol === "ADMIN_GROUP") {
            return "ADMIN_GROUP";
        } else {
            return "USER";
        }
    }

    const role = getRole()

    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SignIn />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/create-user" element={<CreateUser />} />
                {/* <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {role === "ADMIN" && <Route path="/admin" element={<AdminDashboard />} />}
                {role === "ADMIN_GROUP" && <Route path="/admin-group" element={<AdminGroupDashboard />} />}
                {role === "USER" && <Route path="/user" element={<UserDashboard />} />} */}
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter