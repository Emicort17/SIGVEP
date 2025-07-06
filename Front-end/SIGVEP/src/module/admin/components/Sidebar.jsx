import React from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import IconWText from '../../../assets/iconwtext.svg'
import House from '../../../assets/housenp.svg'
import HouseActive from '../../../assets/house.svg'

const menu = [
    { label: 'Inicio', path: '/admin', icon: House, iconActive: HouseActive },
    //   { label: 'Perfil', path: '/admin/profile', icon: require('../../assets/user.svg'), iconActive: require('../../assets/userb.svg') },
    //   { label: 'Usuarios', path: '/admin/users', icon: require('../../assets/users.svg'), iconActive: require('../../assets/usersb.svg') },
    //   { label: 'Categorías', path: '/admin/categories', icon: require('../../assets/categories.svg'), iconActive: require('../../assets/categoriesb.svg') },
    //   { label: 'Productos', path: '/admin/products', icon: require('../../assets/tag.svg'), iconActive: require('../../assets/tagb.svg') },
    //   { label: 'Ventas', path: '/admin/sales', icon: require('../../assets/sales.svg'), iconActive: require('../../assets/salesb.svg') },
    //   { label: 'Bitácora', path: '/admin/log', icon: require('../../assets/log.svg'), iconActive: require('../../assets/logb.svg') },
]

const Sidebar = ({ show = true }) => {
    const navigate = useNavigate()

    return (
        <aside className={`bg-[#24408e] min-h-screen w-64 flex-col py-6 px-3
      fixed md:static z-30 transition-transform duration-300
      ${show ? 'translate-x-0' : '-translate-x-full'} 
      md:flex`}>
            <div className="flex flex-col items-center mb-8">
                <img src={IconWText} alt="SIGVEP" className="w-32 mb-8" />
            </div>
            <nav className="flex-1">
                <ul className="space-y-1">
                    {menu.map((item) => (
                        <li key={item.label}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center w-full px-4 py-2 rounded-lg transition-all font-medium text-lg relative group
                                    ${isActive ? 'bg-[#3b4252] text-[#00baff]' : 'text-gray-300 hover:bg-[#3b4252] hover:text-[#00baff]'}`
                                }
                                style={{ outline: 'none' }}
                            >
                                {({ isActive }) => (
                                    <>
                                        {isActive && (
                                            <span className="absolute left-0 top-0 h-full w-1 bg-[#00baff] rounded-l-lg"></span>
                                        )}
                                        <img
                                            src={isActive ? item.iconActive : item.icon}
                                            alt={item.label}
                                            className="w-6 h-6 mr-3"
                                        />
                                        <span className="transition-colors">{item.label}</span>
                                    </>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
                <button
                    onClick={() => navigate('/admin/sales/new')}
                    className="flex items-center w-full px-4 py-2 mt-4 rounded-lg bg-[#22336b] text-white font-medium text-lg hover:bg-[#1b2a56] transition"
                >
                    {/* <img src={require('../../assets/plus.svg')} alt="Nueva Venta" className="w-5 h-5 mr-3" /> */}
                    Nueva Venta
                </button>
            </nav>
            <button
                onClick={() => {/* handle logout */ }}
                className="flex items-center w-full px-4 py-2 mt-8 rounded-lg bg-[#22336b] text-white font-medium text-base hover:bg-[#1b2a56] transition"
            >
                {/* <img src={require('../../assets/logout.svg')} alt="Cerrar Sesión" className="w-5 h-5 mr-3" /> */}
                Cerrar Sesión
            </button>
        </aside>
    )
}

export default Sidebar