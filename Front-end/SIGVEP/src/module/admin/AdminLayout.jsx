import React from 'react'
import Sidebar from './components/Sidebar'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => (
  <div className="flex min-h-screen">
    <Sidebar />
    <main className="min-h-screen p-6 pl-72">
      <Outlet />
    </main>
  </div>
)

export default AdminLayout