import React, { useState } from 'react'
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from 'react-router-dom';
import { alertaExito, alertaError, alertaCargando } from '../../config/context/alerts.js';

import Logo from '../../assets/icon.svg';
import Fondo from '../../assets/img/fondo.jpg';
import Ojo from '../../assets/eye.svg';
import Ojo1 from '../../assets/eye1.svg';

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const labelStyles = "block mb-2 text-base custom-blue font-medium text-gray-900";
  const inputStyles = "bg-custom-bluelight border-t-0 border-x-0 text-gray-900 text-sm rounded-lg focus:ring-0 block w-full ps-3 p-2.5 custom-border-bottom";

  const formik = useFormik({
    initialValues: {
      code: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: yup.object({
      code: yup.string().required('El código es obligatorio'),
      password: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria'),
      confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Las contraseñas no coinciden')
        .required('Confirma tu contraseña')
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      alertaCargando("Restableciendo contraseña...", "Por favor, espera un momento.");
      try {
        const response = await AxiosClient.post('/auth/reset-password', values);
        if (response.data && response.data.success) {
          alertaExito("¡Contraseña restablecida!", "Ahora puedes iniciar sesión con tu nueva contraseña.");
          resetForm();
          navigate("/");
        }
      } catch (error) {
        alertaError("Error", "No se pudo restablecer la contraseña. Intenta de nuevo.");
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block w-3/4 h-screen">
        <img src={Fondo} alt="Fondo" className='w-full h-full object-cover' />
      </div>
      <div className="w-full md:w-1/3 flex items-center justify-center bg-white">
        <div className="w-full max-w-sm p-8">
          <div className="flex flex-col items-center mb-8">
            <img src={Logo} alt="Logo" className="w-20 h-20 mb-4" />
            <h2 className="text-2xl font-semibold text-blue-900 mb-2">Recuperar Contraseña</h2>
          </div>
          <form noValidate onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label htmlFor="code" className={labelStyles}>
                Código:
              </label>
              <input
                id="code"
                name="code"
                type="text"
                value={formik.values.code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Código"
                className={inputStyles}
              />
              {formik.touched.code && formik.errors.code && (
                <div className="text-red-600 text-sm mt-2">{formik.errors.code}</div>
              )}
            </div>
            <div className="mb-4 relative">
              <label htmlFor="password" className={labelStyles}>
                Contraseña:
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Contraseña"
                className={inputStyles}
              />
              <span
                className="absolute right-3 top-10.5 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <img src={Ojo1} alt="Ocultar contraseña" className="h-5 w-5" />
                ) : (
                  <img src={Ojo} alt="Mostrar contraseña" className="h-5 w-5" />
                )}
              </span>
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-600 text-sm mt-2">{formik.errors.password}</div>
              )}
            </div>
            <div className="mb-6 relative">
              <label htmlFor="confirmPassword" className={labelStyles}>
                Confirmar Contraseña:
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Confirmar Contraseña"
                className={inputStyles}
              />
              <span
                className="absolute right-3 top-10.5 cursor-pointer"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? (
                  <img src={Ojo1} alt="Ocultar contraseña" className="h-5 w-5" />
                ) : (
                  <img src={Ojo} alt="Mostrar contraseña" className="h-5 w-5" />
                )}
              </span>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <div className="text-red-600 text-sm mt-2">{formik.errors.confirmPassword}</div>
              )}
            </div>
            <button
              type="submit"
              disabled={formik.isSubmitting || !formik.isValid}
              className="w-full custom-blue-bottom text-white py-2 rounded hover:bg-blue-900 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-80"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword