import React, { useState } from "react";
import Logo from "../../../assets/iconwcomplete.svg";
import Edit from "../../../assets/edit.svg";
import Lock from "../../../assets/lock.svg";
import Close from "../../../assets/closeb.svg";
import EditInformation from "./EditInformation";
import ChangePasswordModal from "./ChangePasswordModal";

function ProfileModal({ isOpen, onClose, user, onUserUpdate }) {

  if (!isOpen) return null;
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const apellidos = user?.apellido || "";
  const [apellidoPaterno = "", apellidoMaterno = ""] = apellidos.split(" ");

  const datosPersonales = {
    nombre: user?.nombre || "",
    apellidoPaterno,
    apellidoMaterno,
    telefono: user?.telefono || "",
    email: user?.email || "",
    id: user?.id_usuario || "",
  };

  const nombre = user?.nombre || "Usuario";
  const apellido = user?.apellido || "Desconocido";
  const nombreCompleto = nombre + " " + apellido;
  const telefono = user?.telefono || "No disponible";
  const email = user?.email || "No disponible";

  const handleEditModalToggle = () => setShowModalEdit(true);
  const handleCerrarModalEdit = () => setShowModalEdit(false);
  const handleOpenChangePasswordModal = () => setShowChangePasswordModal(true);
  const handleCloseChangePasswordModal = () => setShowChangePasswordModal(false);

  return (
    <>
      <div
        className="fixed inset-0 z-40 flex items-center justify-center"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <div
          className="flex flex-col md:flex-row absolute rounded-lg w-full max-w-[80vw] md:max-w-2xl mx-auto top-1/2 left-1/2 min-md:top-3/12 min-md:left-5/12 -translate-x-1/2 -translate-y-1/2"
        // style={{
        //   top: "4rem",
        //   left: "18rem",
        // }}
        >
          <div className="bg-custom-blue max-md:hidden min-md:rounded-l-lg max-md:rounded-t-lg shadow-lg w-full md:w-60 py-6 flex items-center justify-center md:py-0">
            <img
              src={Logo}
              alt="Logo"
              className="justify-center mx-auto min-md:w-28 max-md:w-20"
            />
          </div>
          <div className="bg-white min-md:rounded-r-lg max-md:rounded-lg shadow-lg max-w-lg w-full relative p-4">
            <div className="grid justify-end">
              <button onClick={onClose} className="cursor-pointer">
                <img src={Close} alt="Cerrar" className="w-6 h-6 max-md:mb-2" />
              </button>
            </div>

            <div className="min-md:space-y-2 max-md:space-y-4">
              <h2 className="text-2xl font-bold font-poppins custom-blue max-md:text-center">
                Perfil Administrador
              </h2>
              <p className="text-lg text-gray-800 font-semibold font-poppins">
                {nombreCompleto || ""}
              </p>
              <p className="text-base text-gray-600 font-poppins">
                {email}
              </p>
              <p className="text-base text-gray-600 font-poppins">
                Teléfono: {telefono}
              </p>
            </div>

            <div className="flex flex-col md:flex-row mt-6 min-md:justify-center min-md:items-center min-md:gap-2 w-full">
              <button
                onClick={handleEditModalToggle}
                className="flex items-center gap-1 custom-blue bg-gray-100 hover:bg-gray-300 font-poppins rounded-lg text-base px-5 py-2.5 cursor-pointer max-md:justify-center"
              >
                <img src={Edit} alt="Editar" className="w-6 h-6" />
                Editar Información
              </button>
              <button
                onClick={handleOpenChangePasswordModal}
                className="flex items-center gap-1 custom-blue bg-gray-100 hover:bg-gray-300 font-poppins rounded-lg text-base px-5 py-2.5 cursor-pointer max-md:justify-center"
              >
                <img src={Lock} alt="Cambiar Contraseña" className="w-6 h-6" />
                Cambiar Contraseña
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModalEdit && (
        <EditInformation
          isOpen={showModalEdit}
          onClose={handleCerrarModalEdit}
          datosPersonales={datosPersonales}
          onSuccess={(updatedUser) => {
            if (onUserUpdate) onUserUpdate(updatedUser);
          }}
        />
      )}

      {showChangePasswordModal && (
        <ChangePasswordModal
          isOpen={showChangePasswordModal}
          onClose={handleCloseChangePasswordModal}
          datosPersonales={datosPersonales}
          onSuccess={(updatedUser) => {
            if (onUserUpdate) onUserUpdate(updatedUser);
          }}
        />
      )}
    </>
  );
}

export default ProfileModal;