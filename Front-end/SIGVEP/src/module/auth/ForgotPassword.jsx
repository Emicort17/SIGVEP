import React, { useState } from 'react'
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from 'react-router-dom';
import { alertaExito, alertaError, alertaCargando } from '../../config/context/alerts.js';

import Logo from '../../assets/icon.svg';
import Fondo from '../../assets/img/fondo.jpg';
import { AxiosClient } from '../../config/http-gateway/http-client.js';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const labelStyles = "block mb-2 text-base custom-blue font-medium text-gray-900";
  const inputStyles = "bg-custom-bluelight border-t-0 border-x-0 text-gray-900 text-sm rounded-lg focus:ring-0 block w-full ps-3 p-2.5 custom-border-bottom";

  const formik = useFormik({
    initialValues: {
      toEmail: '',
    },
    validationSchema: yup.object({
      toEmail: yup.string().email('Correo inválido').required('El correo es obligatorio'),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      alertaCargando("Enviando correo...", "Por favor, espera un momento.");
      try {
        const response = await AxiosClient.post('/auth/recover/send-mail', values);
        if (response.data && response.status === "OK") {
          console.log('ForgotPassword response: ', response.data);
          alertaExito("¡Correo enviado!", "Revisa tu correo para el código de recuperación.");
          resetForm();
          sessionStorage.setItem('resetToken', response.data.token);
          sessionStorage.setItem('email', response.data.correo);
          navigate("/reset-password");
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'No se pudo enviar el correo.';
        alertaError("Error", errorMessage);
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
          <div className="flex flex-col items-center mb-4">
            <img src={Logo} alt="Logo" className="w-20 h-20 mb-4" />
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">Recuperar Contraseña</h2>
            <p className="text-sm text-gray-600 text-left mb-2">
              Ingresa tu correo electrónico para recibir un enlace de recuperación de contraseña.
            </p>
          </div>
          <form noValidate onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label htmlFor="toEmail" className={labelStyles}>
                Correo Electrónico:
              </label>
              <input
                id="toEmail"
                name="toEmail"
                type="email"
                value={formik.values.toEmail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Correo electrónico"
                className={inputStyles}
              />
              {formik.touched.toEmail && formik.errors.toEmail && (
                <div className="text-red-600 text-sm mt-2">{formik.errors.toEmail}</div>
              )}
            </div>
            <button
              type="submit"
              disabled={formik.isSubmitting || !formik.isValid}
              className="w-full custom-blue-bottom text-white py-2 rounded hover:bg-blue-900 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-80"
            >
              Enviar
            </button>
            <div className="mt-4 text-center">
              <button
                type="button"
                className="custom-blue text-sm hover:underline bg-transparent border-none cursor-pointer"
                onClick={() => navigate("/", { replace: false })}
              >
                Volver
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword