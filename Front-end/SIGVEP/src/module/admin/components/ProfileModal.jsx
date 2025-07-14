import React, { useState } from 'react';
import Logo from '../../../assets/iconw.svg';
// import EditProfile from './EditProfile';
// import EditPassword from './EditPassword';

const ProfileModal = ({ user, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);

  const handleEditModalToggle = () => {
    setIsEditing(!isEditing);
    setIsChangePassword(false);
  };

  const handleChangePasswordModalToggle = () => {
    setIsChangePassword(!isChangePassword);
    setIsEditing(false);
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      {!isEditing && !isChangePassword ? (
        <div
          className="flex absolute right-2/5 bg-custom-blue rounded-l-lg"
          style={{
            top: '11%',
          }}
        >
          <div className="bg-custom-green1 rounded-l-lg shadow-lg w-60 flex items-center hidden md:flex">
            <img
              src={Logo}
              alt="Logo"
              className="justify-center mx-auto w-60"
            />
          </div>

          <div className="bg-white rounded-r-lg shadow-lg max-w-lg w-full relative p-4 dark:bg-gray-900">
            <div className="grid justify-end">
              <button onClick={onClose} className="cursor-pointer">
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-poppins">
                Perfil Administrador {user?.usuario?.usuario || 'Usuario'}
              </h2>
              <p className="text-lg text-gray-800 font-semibold font-poppins dark:text-gray-300">
                {user?.usuario?.nombre || ''} {user?.usuario?.apellido_p || ''}{' '}
                {user?.usuario?.apellido_m || ''}
              </p>
              <p className="text-base text-gray-600 font-poppins dark:text-gray-300">
                {user?.usuario?.correo || ''}
              </p>
              <p className="text-base text-gray-600 font-poppins dark:text-gray-300">
                {user?.usuario?.telefono || ''}
              </p>
            </div>

            <div className="flex flex-col md:flex-row justify-between mt-6 space-y-4 md:space-y-0">
              <button
                onClick={handleEditModalToggle}
                className="flex items-center hover:text-gray-800 hover:bg-gray-100 font-poppins rounded-lg text-base px-5 py-2.5"
              >
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                  />
                </svg>
                Editar Información
              </button>
              <button
                onClick={handleChangePasswordModalToggle}
                className="flex items-center hover:text-gray-800 hover:bg-gray-100 font-poppins rounded-lg text-base px-5 py-2.5"
              >
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 14v3m-3-6V7a3 3 0 1 1 6 0v4m-8 0h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z"
                  />
                </svg>
                Cambiar Contraseña
              </button>
            </div>
          </div>
        </div>
      ) : isEditing ? (
        <EditProfile
          user={user}
          onClose={onClose}
          handleEditModalToggle={handleEditModalToggle}
        />
      ) : (
        <EditPassword
          user={user}
          onClose={onClose}
          handleChangePasswordModalToggle={handleChangePasswordModalToggle}
        />
      )}
    </div>
  );
};

export default ProfileModal;