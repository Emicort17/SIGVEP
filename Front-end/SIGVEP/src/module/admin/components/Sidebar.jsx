import React, { useContext, useState } from 'react'
import { useNavigate, NavLink, useLocation } from 'react-router-dom'
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
import IconW from '../../../assets/iconw.svg'
import AuthContext from '../../../config/context/auth-context'
import Close from '../../../assets/close.svg'
import Menu from '../../../assets/menu.svg'

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
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const sortedMenu = [...menu].sort((a, b) => b.path.length - a.path.length);
    const currentLabel = sortedMenu.find(item => location.pathname.startsWith(item.path))?.label || 'Inicio';

    const handleMenuClick = () => {
        if (window.innerWidth < 768) setOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: 'SIGNOUT' });
        navigate('/sign-in');
    };

    return (
        <>
            <div className="md:hidden flex items-center justify-between px-6 py-3 bg-custom-blue w-full fixed top-0 left-0 z-40">
                <button
                    className="bg-transparent p-2"
                    onClick={() => setOpen(true)}
                    aria-label="Abrir menú"
                >
                    <img src={Menu} alt="Menu" className="w-8 h-8 cursor-pointer" />
                </button>
                <span className="text-white text-2xl font-semibold">{currentLabel}</span>
                <img src={IconW} alt="Logo" className="w-10 h-10" />
            </div>

            {open && (
                <div
                    className="fixed inset-0 z-40 md:hidden"
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
                    onClick={() => setOpen(false)}
                />
            )}

            <aside
                className={`
                    bg-custom-blue h-screen w-64 flex flex-col py-6 fixed left-0 top-0 z-40
                    transition-transform duration-300
                    ${open ? 'translate-x-0' : '-translate-x-full'} 
                    md:translate-x-0
                `}
            >
                <div className="md:hidden flex justify-end px-4 mt-2">
                    <button
                        className="text-white text-2xl"
                        onClick={() => setOpen(false)}
                        aria-label="Cerrar menú"
                    >
                        <img src={Close} alt="Cerrar menú" className='w-6 h-6 cursor-pointer' />
                    </button>
                </div>
                <div className="flex flex-col items-center mb-2 mt-2">
                    <img src={IconWText} alt="SIGVEP" className="w-32 mb-5" />
                </div>
                <nav className="flex-1 overflow-y-auto">
                    <ul className="space-y-2">
                        {menu.map((item) => (
                            <li key={item.label} className="px-3">
                                {item.label === 'Perfil' ? (
                                    <div
                                        onClick={() => {
                                            onProfileClick(); 
                                            handleMenuClick();
                                        }}
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
                                        onClick={handleMenuClick}
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
                            onClick={handleMenuClick}
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
        </>
    )
}

export default Sidebar