import React, { useContext, useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import IconWText from '../../../assets/iconwtext.svg'
import House from '../../../assets/housed.svg'
import HouseActive from '../../../assets/house.svg'
import Person from '../../../assets/persond.svg'
import PersonActive from '../../../assets/person.svg'
import Users from '../../../assets/usersd.svg'
import UsersActive from '../../../assets/users.svg'
import Category from '../../../assets/categoryd.svg'
import CategoryActive from '../../../assets/category.svg'
import Products from '../../../assets/productsd.svg'
import ProductsActive from '../../../assets/products.svg'
import Sale from '../../../assets/saled.svg'
import SaleActive from '../../../assets/sale.svg'
import Binnacle from '../../../assets/binnacled.svg'
import BinnacleActive from '../../../assets/binnacle.svg'
import Plus from '../../../assets/plusd.svg'
import PlusActive from '../../../assets/plus.svg'
import Logout from '../../../assets/logoutd.svg'
import AuthContext from '../../../config/context/auth-context'
import { AxiosClient } from '../../../config/http-gateway/http-client'

const menu = [
    { label: 'Inicio', path: '/admin', icon: House, iconActive: HouseActive },
    { label: 'Perfil', path: '/admin/profile', icon: Person, iconActive: PersonActive },
    { label: 'Usuarios', path: '/admin/users', icon: Users, iconActive: UsersActive },
    { label: 'Categorías', path: '/admin/categories', icon: Category, iconActive: CategoryActive },
    { label: 'Productos', path: '/admin/products', icon: Products, iconActive: ProductsActive },
    { label: 'Ventas', path: '/admin/sales', icon: Sale, iconActive: SaleActive },
    { label: 'Bitácora', path: '/admin/log', icon: Binnacle, iconActive: BinnacleActive },
];

const Sidebar = ({ show = true, onProfileClick, isProfileActive }) => {
    const navigate = useNavigate()
    const { dispatch } = useContext(AuthContext);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: 'SIGNOUT' });
        navigate('/sign-in');
    };

    return (
        <aside className={`bg-custom-blue h-screen w-64 flex flex-col py-6 fixed left-0 top-0 z-30
                            ${show ? 'translate-x-0' : '-translate-x-full'} md:flex`}>
            <div className="flex flex-col items-center mb-2 mt-2">
                <img src={IconWText} alt="SIGVEP" className="w-32 mb-5" />
            </div>
            <nav className="flex-1 overflow-y-auto">
                <ul className="space-y-2">
                    {menu.map((item) => (
                        <li key={item.label} className="px-3">
                            {item.label === 'Perfil' ? (
                                <div
                                    onClick={onProfileClick}
                                    className={`flex items-center py-2 px-4 rounded-lg transition-all font-medium text-lg relative cursor-pointer ${isProfileActive ? 'bg-[#122353] text-[#0EA5E9]' : 'text-gray-300 hover:bg-[#122353] hover:text-gray-300'
                                        }`}
                                >
                                    {isProfileActive ? (
                                        <span className="absolute -left-3 top-0 h-full w-1 bg-custom-side rounded-r-lg"></span>
                                    ) : (
                                        <span className="" />
                                    )}
                                    <img
                                        src={isProfileActive ? item.iconActive : item.icon}
                                        alt={item.label}
                                        className="w-5 h-5 mr-3"
                                    />
                                    <span className="transition-none">{item.label}</span>
                                </div>
                            ) : (
                                <NavLink
                                    to={item.path}
                                    className="block"
                                    style={{ outline: 'none' }}
                                    end
                                >
                                    {({ isActive }) => (
                                        <div
                                            className={`flex items-center py-2 px-4 rounded-lg transition-all font-medium text-lg relative
                                                    ${isActive ? 'bg-[#122353] text-[#0EA5E9]' : 'text-gray-300 hover:bg-[#122353] hover:text-gray-300'}`}
                                        >
                                            {isActive ? (
                                                <span className="absolute -left-3 top-0 h-full w-1 bg-custom-side rounded-r-lg"></span>
                                            ) : (
                                                <span className="" />
                                            )}
                                            <img
                                                src={isActive ? item.iconActive : item.icon}
                                                alt={item.label}
                                                className="w-5 h-5 mr-3"
                                            />
                                            <span className="transition-none">{item.label}</span>
                                        </div>
                                    )}
                                </NavLink>
                            )}

                        </li>
                    ))}
                </ul>
                <div className="px-3 mt-2">
                    <NavLink
                        to="/admin/new-sale"
                        className="block"
                        style={{ outline: 'none' }}
                        end
                    >
                        {({ isActive }) => (
                            <div
                                className={`flex items-center py-2 px-4 rounded-lg transition-all font-medium text-lg relative
                                            ${isActive ? 'bg-[#122353] text-[#0EA5E9]' : 'text-white bg-[#122353] hover:text-white'}`}
                            >
                                {isActive ? (
                                    <span className="absolute -left-3 top-0 h-full w-1 bg-custom-side rounded-r-lg"></span>
                                ) : (
                                    <span className="" />
                                )}
                                <img
                                    src={isActive ? PlusActive : Plus}
                                    alt="Nueva Venta"
                                    className="w-5 h-5 mr-3"
                                />
                                <span className="transition-none">Nueva Venta</span>
                            </div>
                        )}
                    </NavLink>
                </div>
            </nav>
            <div className="px-3 mt-8">
                <div
                    onClick={handleLogout}
                    className={`flex items-center py-2 px-4 rounded-lg transition-all font-medium cursor-pointer text-base relative
                      text-white hover:bg-[#122353] hover:text-white`}
                >
                    <img src={Logout} alt="Cerrar Sesión" className="w-5 h-5 mr-3" />
                    <span className="transition-colors">Cerrar Sesión</span>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar