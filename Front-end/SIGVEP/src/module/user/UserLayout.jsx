import React, { useState, useEffect } from 'react';
import SidebarU from './components/SidebarU';
import ProfileModalU from './components/ProfileModalU';
import { Outlet } from 'react-router-dom';
import { AxiosClient } from '../../config/http-gateway/http-client';

const UserLayout = () => {
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
    <div className="h-screen">
      <SidebarU show={true} onProfileClick={handleProfileClick} isProfileActive={isProfileModalOpen} />
      <main className="min-h-screen max-md:p-6 md:pl-72 transition-all min-md:p-6 max-md:py-20">
        <Outlet />
      </main>
      {isProfileModalOpen && userData && (
        <ProfileModalU
          user={userData}
          onClose={() => setIsProfileModalOpen(false)}
          isOpen={isProfileModalOpen}
          onUserUpdate={setUserData}
        />
      )}
    </div>
  );
};

export default UserLayout;