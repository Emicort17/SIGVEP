import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useFormik } from 'formik';
import AuthContext from '../../config/context/auth-context';
import { AxiosClient } from '../../config/http-gateway/http-client';
import { alertaExito, alertaError, alertaCargando } from '../../config/context/alerts.js';
import Logo from '../../assets/icon.svg';
import Fondo from '../../assets/img/fondo.jpg';
import Ojo from '../../assets/eye.svg';
import Ojo1 from '../../assets/eye1.svg';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const labelStyles = "block mb-2 text-base custom-blue font-medium text-gray-900";
  const inputStyles = "bg-custom-bluelight border-t-0 border-x-0 text-gray-900 text-sm rounded-lg focus:ring-0 block w-full ps-3 p-2.5 custom-border-bottom";

  const formik = useFormik({
    initialValues: {
      emailOrUsername: '',
      password: ''
    },
    validationSchema: yup.object({
      emailOrUsername: yup.string().email('Correo electrónico inválido').required('El correo electrónico es obligatorio'),
      password: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      alertaCargando("Iniciando sesión...", "Por favor, espera un momento.");
      try {
        const response = await AxiosClient.post('/auth/signin', values);
        console.log('SignIn response: ', response.data);
        if (response.data && response.data.token && response.data.user) {
          const { token, user } = response.data;
          if (!user?.rol) {
            alertaError('Error','El usuario no tiene un rol asignado');
          }
          const authData = { token, user, signed: true };
          dispatch({
            type: 'SIGNIN',
            payload: authData,
          });
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(authData));
          alertaExito('Inicio de sesión exitoso', 'Bienvenido al sistema SIGVEP');
          const redirectTo = user.rol === 'ADMIN_ROLE' ? '/admin' : '/user';
          navigate(redirectTo, { replace: true });
        } else {
          alertaError("Error", "Error al iniciar sesión. Por favor, verifica tus credenciales.");
        }
      } catch (error) {
        alertaError("Error", "Correo y/o contraseña incorrectos");
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <>
      <div className="flex min-h-screen">
        <div className="hidden md:block w-3/4 h-screen">
          <img src={Fondo} alt="Fondo" className='w-full h-full object-cover' />
        </div>

        <div className="w-full md:w-1/3 flex items-center justify-center bg-white">
          <div className="w-full max-w-sm p-8">
            <div className="flex flex-col items-center mb-8">
              <img src={Logo} alt="Logo" className="w-20 h-20 mb-4 " />
              <h2 className="text-2xl font-bold text-blue-900">Iniciar sesión</h2>
            </div>
            <form noValidate onSubmit={formik.handleSubmit}>
              <div className="mb-4">
                <label htmlFor="emailOrUsername" className={labelStyles}>
                  Correo Electrónico:
                </label>
                <input
                  id="emailOrUsername"
                  name="emailOrUsername"
                  type="email"
                  value={formik.values.emailOrUsername}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Correo electrónico"
                  className={inputStyles}
                />
                {formik.touched.emailOrUsername && formik.errors.emailOrUsername && (
                  <div className="text-red-600 text-sm mt-2">{formik.errors.emailOrUsername}</div>
                )}
              </div>
              <div className="mb-2 relative">
                <label htmlFor="password" className={labelStyles}>
                  Contraseña:
                </label>
                <input
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  className={inputStyles}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="text-red-600 text-sm mt-2">{formik.errors.password}</div>
                )}
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
              </div>

              <div className="mb-4 text-right mt-3">
                <a className="custom-blue text-sm hover:underline cursor-pointer" onClick={() => navigate('/forgot-password')}>
                  ¿Has olvidado tu contraseña?
                </a>
              </div>

              <button
                type="submit"
                disabled={formik.isSubmitting || !formik.isValid}
                className="w-full custom-blue-bottom text-white py-2 rounded hover:bg-blue-900 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-80"
              >
                Ingresar
              </button>

              <div className="mt-4 text-center text-sm">
                ¿No tienes una cuenta?{" "}
                <a className="custom-blue hover:underline cursor-pointer" onClick={() => navigate('/create-user')}>
                  Regístrate
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignIn
