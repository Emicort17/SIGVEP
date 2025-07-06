import React from 'react'
import { useNavigate } from 'react-router-dom'
import Fondo from '../../assets/img/fondo.jpg'
import Logo from '../../assets/iconw.svg'
import Arrow from '../../assets/arrowlw.svg'

const NotFound404 = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative">
      <img
        src={Fondo}
        alt="Fondo"
        className="fixed inset-0 w-full h-full object-cover z-0"
      />
      <div className="flex flex-col items-center justify-center text-center z-10 w-full px-4 pb-16">
        <img src={Logo} alt="Logo" className="w-20 h-20 md:w-30 md:h-30 mb-6 mt-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" />
        <h1 className="text-6xl md:text-9xl font-bold text-white mb-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">404</h1>
        <h2 className="text-2xl md:text-4xl font-semibold text-white mb-4 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">Página no encontrada</h2>
        <div className="bg-white bg-opacity-80 rounded-lg px-4 py-3 md:px-6 md:py-4 mb-8 text-center max-w-xs md:max-w-2xl shadow">
          <p className="text-gray-800 text-sm md:text-base">
            Parece que la página que estás buscando no existe o fue movida.
            <br />
            Verifica la URL o regresa al inicio.
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 custom-blue-bottom text-white px-4 py-2 md:px-5 md:py-2 rounded hover:bg-blue-900 transition cursor-pointer"
        >
          <img src={Arrow} alt="Volver" className="w-4 h-4" />
          Volver al Inicio
        </button>
      </div>
    </div>
  )
}

export default NotFound404