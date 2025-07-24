import React, { useState } from 'react';
import Close from '../../../assets/closeb.svg';
import Ojo from '../../../assets/eye.svg';
import Ojo1 from '../../../assets/eye1.svg';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { alertaCargando, alertaError, alertaExito } from '../../../config/context/alerts';
import { AxiosClient } from '../../../config/http-gateway/http-client';

function ChangePasswordModal({ isOpen, onClose, datosPersonales, onSuccess }) {
  const labelStyles = "block mb-2 text-base custom-blue font-medium text-gray-900";
  const inputStyles = "bg-custom-bluelight border-t-0 border-x-0 text-gray-900 text-sm rounded-lg focus:ring-0 block w-full ps-3 p-2.5 custom-border-bottom";

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: yup.object({
      oldPassword: yup.string().required('La contraseña actual es obligatoria'),
      newPassword: yup.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .required('La contraseña es obligatoria'),
      confirmPassword: yup.string()
        .oneOf([yup.ref('newPassword')], 'Las contraseñas no coinciden')
        .required('Confirma la nueva contraseña'),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      console.log('Submitting ChangePasswordModal with values:', values);
      alertaCargando('Cambiando contraseña...', 'Por favor, espere');
      try {
        const response = await AxiosClient.patch('/usuarios/change-password', {
          userId: datosPersonales?.id,
          contrasenaActual: values.oldPassword,
          nuevaContrasena: values.newPassword,
        });
        if (response?.status === "OK") {
          alertaExito('Éxito', '¡Contraseña cambiada correctamente!');
          resetForm();
          if (onSuccess) onSuccess();
          onClose();
        }
      } catch (error) {
        console.log('ChangePassword error: ', error);
        if (error?.response?.data?.message === 'La contraseña actual es incorrecta.') {
          alertaError('Error', 'La contraseña actual es incorrecta.');
        } else {
          alertaError('Error', 'No se pudo cambiar la contraseña');
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-6" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        <div className="absolute top-4 right-4">
          <button onClick={onClose} className="cursor-pointer">
            <img src={Close} alt="Cerrar" className="w-6 h-6" />
          </button>
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 font-poppins">Cambiar Contraseña</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className={labelStyles}>Contraseña Anterior:</label>
            <div className="relative">
              <input
                type={showOld ? 'text' : 'password'}
                name="oldPassword"
                value={formik.values.oldPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputStyles}
                placeholder="Contraseña Anterior"
                autoComplete="current-password"
              />
              <span
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => setShowOld(!showOld)}
              >
                <img src={showOld ? Ojo1 : Ojo} alt="Mostrar/Ocultar" className="h-5 w-5" />
              </span>
            </div>
            {formik.touched.oldPassword && formik.errors.oldPassword && (
              <div className="text-red-600 text-sm mt-1">{formik.errors.oldPassword}</div>
            )}
          </div>
          <div>
            <label className={labelStyles}>Nueva Contraseña:</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                name="newPassword"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputStyles}
                placeholder="Nueva Contraseña"
                autoComplete="new-password"
              />
              <span
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => setShowNew(!showNew)}
              >
                <img src={showNew ? Ojo1 : Ojo} alt="Mostrar/Ocultar" className="h-5 w-5" />
              </span>
            </div>
            {formik.touched.newPassword && formik.errors.newPassword && (
              <div className="text-red-600 text-sm mt-1">{formik.errors.newPassword}</div>
            )}
          </div>
          <div>
            <label className={labelStyles}>Confirmar Nueva Contraseña:</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputStyles}
                placeholder="Confirmar Nueva Contraseña"
                autoComplete="new-password"
              />
              <span
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                <img src={showConfirm ? Ojo1 : Ojo} alt="Mostrar/Ocultar" className="h-5 w-5" />
              </span>
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <div className="text-red-600 text-sm mt-1">{formik.errors.confirmPassword}</div>
            )}
          </div>
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-300 text-gray-700 font-medium rounded-lg px-5 py-2 w-32 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={formik.isSubmitting || !formik.isValid}
              className="custom-blue-bottom text-white hover:bg-blue-900 font-medium rounded-lg px-5 py-2 w-32 cursor-pointer disabled:cursor-not-allowed disabled:opacity-80"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
