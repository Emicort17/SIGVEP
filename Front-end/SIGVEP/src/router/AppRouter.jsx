import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminLayout from '../module/admin/AdminLayout'
import Main from '../module/admin/Main'
import Products from '../module/admin/Products'
import SignIn from '../module/auth/SignIn'
import ForgotPassword from '../module/auth/ForgotPassword'
import ResetPassword from '../module/auth/ResetPassword'
import CreateUser from '../module/auth/CreateUser'
import NotFound404 from '../module/auth/NotFound404'
import InternalServerError500 from '../module/auth/InternalServerError500'
import Forbidden403 from '../module/auth/Forbidden403'
import Binnacle from '../module/admin/Binnacle'
import Categories from '../module/admin/Categories'
import Profile from '../module/admin/Profile'
import Users from '../module/admin/Users'
import Sales from '../module/admin/Sales'
import NewSales from '../module/admin/NewSales'

const staticUser = {
  usuario: {
    rol: {
      rol: "ADMIN" 
    }
  },
  token: "fake-token"
}

const AppRouter = () => {
  const [user] = useState(staticUser)

  const getRole = () => {
    if (user?.usuario?.rol.rol === "ADMIN") {
      return "ADMIN"
    } else {
      return "USER"
    }
  }

  const role = getRole()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/500" element={<InternalServerError500 />} />
        <Route path="/403" element={<Forbidden403 />} />

        {role === "ADMIN" && (
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Main />} />
            <Route path="profile" element={<Profile />} />
            <Route path="users" element={<Users />} />
            <Route path="categories" element={<Categories />} />
            <Route path="products" element={<Products />} />
            <Route path="sales" element={<Sales />} />
            <Route path="log" element={<Binnacle />} />
            <Route path="new-sale" element={<NewSales />} />
          </Route>
        )}

        {/* {role === "USER" && (
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<MainUser />} />
          </Route>
        )} */}

        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter