import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import ProfileModal from './components/ProfileModal';
import { Outlet } from 'react-router-dom'
import { AxiosClient } from '../../config/http-gateway/http-client';

const AdminLayout = () => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleProfileClick = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser?.user?.idUsuario) {
      setIsProfileModalOpen(true);
      fetchUserData(storedUser.user.idUsuario);
    }
  };

  const fetchUserData = async (idUsuario) => {
    try {
      const response = await AxiosClient.get(`/usuarios/${idUsuario}`);
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar show={true} onProfileClick={handleProfileClick} isProfileActive={isProfileModalOpen} />
      <main className="flex-1 min-h-screen max-md:p-6 md:pl-72 transition-all max-md:py-20">
        <Outlet />
      </main>
      {isProfileModalOpen && userData && (
        <ProfileModal
          user={userData}
          onClose={() => setIsProfileModalOpen(false)}
          isOpen={isProfileModalOpen}
          onUserUpdate={setUserData}
        />
      )}
    </div>
  );
};

export default AdminLayout