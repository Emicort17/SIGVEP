import React, { useState } from 'react'
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from 'react-router-dom';
import { alertaExito, alertaError, alertaCargando } from '../../config/context/alerts.js';

import Logo from '../../assets/iconw.svg';
import Fondo from '../../assets/img/fondo.jpg';
import Ojo from '../../assets/eye.svg';
import Ojo1 from '../../assets/eye1.svg';

const CreateUser = () => {
    // Por terminar...
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();
    const labelStyles = "block mb-2 text-base custom-blue font-medium text-gray-900";
    const inputStyles = "bg-custom-bluelight border-t-0 border-x-0 text-gray-900 text-sm rounded-lg focus:ring-0 block w-full ps-3 p-2.5 custom-border-bottom";

    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellidoPaterno: '',
            apellidoMaterno: '',
            email: '',
            telefono: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: yup.object({
            nombre: yup.string().required('El nombre es obligatorio'),
            apellidoPaterno: yup.string().required('El apellido paterno es obligatorio'),
            apellidoMaterno: yup.string().required('El apellido materno es obligatorio'),
            email: yup.string().email('Correo electrónico inválido').required('El correo electrónico es obligatorio'),
            telefono: yup.string().matches(/^[0-9]{10}$/, 'El teléfono debe tener 10 dígitos').required('El teléfono es obligatorio'),
            password: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria'),
            confirmPassword: yup.string()
                .oneOf([yup.ref('password'), null], 'Las contraseñas no coinciden')
                .required('Confirma tu contraseña')
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            alertaCargando("Creando cuenta...", "Por favor, espera un momento.");
            try {
                const response = await AxiosClient.post('/auth/create-user', values);
                if (response.data && response.data.success) {
                    alertaExito("¡Cuenta creada!", "Ahora puedes iniciar sesión.");
                    resetForm();
                    navigate("/");
                } else {
                    alertaError("Error", "No se pudo crear la cuenta. Por favor, verifica tus datos.");
                }
            } catch (error) {
                alertaError("Error", "No se pudo crear la cuenta. Intenta de nuevo.");
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <div className="flex min-h-screen">
            <div className="hidden md:flex flex-col w-3/4 h-screen items-center justify-center relative">
                <img src={Fondo} alt="Fondo" className='w-full h-full object-cover absolute inset-0 z-0' />
                <div className='relative z-10 flex flex-col w-full items-center justify-center'>
                    <img src={Logo} alt="Logo" className="w-30 h-30 mb-8" />
                    <div className="flex flex-col gap-6 w-96">
                        <div className="bg-white bg-opacity-60 rounded-lg p-4 flex items-center gap-3 shadow">
                            <span className="text-2xl">🛒</span>
                            <div>
                                <div className="font-semibold text-gray-800">Compra productos fácil y rápido</div>
                                <div className="text-xs text-gray-600">Realiza compras en segundos.</div>
                            </div>
                        </div>
                        <div className="bg-white bg-opacity-60 rounded-lg p-4 flex items-center gap-3 shadow">
                            <span className="text-2xl">📋</span>
                            <div>
                                <div className="font-semibold text-gray-800">Consulta tu historial de compras</div>
                                <div className="text-xs text-gray-600">Mantén un control detallado.</div>
                            </div>
                        </div>
                        <div className="bg-white bg-opacity-60 rounded-lg p-4 flex items-center gap-3 shadow">
                            <span className="text-2xl">🏷️</span>
                            <div>
                                <div className="font-semibold text-gray-800">Todo al alcance de tu mano</div>
                                <div className="text-xs text-gray-600">Simple e intuitiva, sin complicaciones.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full md:w-1/3 flex items-center justify-center bg-white">
                <div className="w-full max-w-sm p-8">
                    <h2 className="text-2xl font-semibold text-blue-900 mb-6 text-center">Crea una cuenta</h2>
                    <form noValidate onSubmit={formik.handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="nombre" className={labelStyles}>Nombre:</label>
                            <input
                                id="nombre"
                                name="nombre"
                                type="text"
                                value={formik.values.nombre}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Nombre"
                                className={inputStyles}
                            />
                            {formik.touched.nombre && formik.errors.nombre && (
                                <div className="text-red-600 text-sm mt-2">{formik.errors.nombre}</div>
                            )}
                        </div>
                        <div className="mb-4 flex gap-2">
                            <div className="w-1/2">
                                <label htmlFor="apellidoPaterno" className={labelStyles}>Apellido Paterno:</label>
                                <input
                                    id="apellidoPaterno"
                                    name="apellidoPaterno"
                                    type="text"
                                    value={formik.values.apellidoPaterno}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Apellido Paterno"
                                    className={inputStyles}
                                />
                                {formik.touched.apellidoPaterno && formik.errors.apellidoPaterno && (
                                    <div className="text-red-600 text-sm mt-2">{formik.errors.apellidoPaterno}</div>
                                )}
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="apellidoMaterno" className={labelStyles}>Apellido Materno:</label>
                                <input
                                    id="apellidoMaterno"
                                    name="apellidoMaterno"
                                    type="text"
                                    value={formik.values.apellidoMaterno}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Apellido Materno"
                                    className={inputStyles}
                                />
                                {formik.touched.apellidoMaterno && formik.errors.apellidoMaterno && (
                                    <div className="text-red-600 text-sm mt-2">{formik.errors.apellidoMaterno}</div>
                                )}
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className={labelStyles}>Correo Electrónica:</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Correo electrónico"
                                className={inputStyles}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div className="text-red-600 text-sm mt-2">{formik.errors.email}</div>
                            )}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="telefono" className={labelStyles}>Teléfono:</label>
                            <input
                                id="telefono"
                                name="telefono"
                                type="text"
                                value={formik.values.telefono}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Teléfono"
                                className={inputStyles}
                                maxLength={10}
                            />
                            {formik.touched.telefono && formik.errors.telefono && (
                                <div className="text-red-600 text-sm mt-2">{formik.errors.telefono}</div>
                            )}
                        </div>
                        <div className="mb-4 relative">
                            <label htmlFor="password" className={labelStyles}>Contraseña:</label>
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
                            <label htmlFor="confirmPassword" className={labelStyles}>Confirmar Contraseña:</label>
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
                        <div className="mt-4 text-center text-sm">
                            ¿Ya estás registrado?{" "}
                            <span
                                className="custom-blue hover:underline cursor-pointer"
                                onClick={() => navigate("/")}
                            >
                                Ingresa a tu cuenta
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateUser;