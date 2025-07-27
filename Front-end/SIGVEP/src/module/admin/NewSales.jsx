import React from 'react'
import { useState } from 'react'

import search_white from '../../assets/search_white.svg';
import Category from '../../assets/categoryd.svg'
import shopping_cart from '../../assets/shopping_cart.svg'

const productsData = [
  { id: 1, nombre: "Guantes de boxeo", precio: 152, stock: 52 },
  { id: 2, nombre: "Agua embotellada", precio: 15, stock: 78 },
  { id: 3, nombre: "Papel higiénico", precio: 21, stock: 84 },
  { id: 4, nombre: "Chocolates Hershy", precio: 18, stock: 25 },
  { id: 5, nombre: "Paraguas", precio: 200, stock: 12 },
  { id: 6, nombre: "Salchichas", precio: 54, stock: 55 },
  { id: 7, nombre: "Agua gasificada", precio: 32, stock: 48 },
  { id: 8, nombre: "Huevos", precio: 40, stock: 48 },
  { id: 9, nombre: "Pan bimbo", precio: 38, stock: 85 },
  { id: 10, nombre: "Desodorante", precio: 60, stock: 72 },
  { id: 11, nombre: "Cloro", precio: 78, stock: 32 },
  { id: 12, nombre: "Jabón ZOTE", precio: 12, stock: 11 },
]

function NewSales() {
  const [carrito, setCarrito] = useState([])
  const [pagina, setPagina] = useState(1)
  const [Buscar, setBusqueda] = useState("")
  const productos = 11

  const filtroProductos = productsData.filter((product) =>
    product.nombre.toLowerCase().includes(Buscar.toLowerCase()),
  )

  const paginasTotales = Math.ceil(filtroProductos.length / productos)
  const inicio = (pagina - 1) * productos
  const lista_productos = filtroProductos.slice(inicio, inicio + productos)

  const añadircarrito = (product) => {
    const existingItem = carrito.find((item) => item.id === product.id)
    if (existingItem) {
      setCarrito(carrito.map((item) => (item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item)))
    } else {
      setCarrito([...carrito, { ...product, cantidad: 1 }])
    }
  }

  const eliminarcarrito = (productId) => {
    setCarrito(carrito.filter((item) => item.id !== productId))
  }

  const preciototal = () => {
    return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0)
  }

  const totaldeproductos = () => {
    return carrito.reduce((total, item) => total + item.cantidad, 0)
  }

  const getStock = (stock) => {
    if (stock <= 20) return "text-red-500"
    if (stock <= 50) return "text-orange-500"
    return "text-green-500"
  }

  return (
    <div className='flex gap-5 p-5 bg-gray-100 min-h-screen'>

      <div className="flex-1 w-2/3 rounded-lg p-5 ">
        <h2 className="text-2xl font-bold mb-5 text-gray-800">Productos</h2>

        <div className="flex gap-4 mb-5 items-center">
          <div className="relative flex-1 relative w-full">
            <img
              src={search_white}
              alt="Buscar"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60"
            />
            <input
              type="text"
              placeholder="Buscar..."
              value={Buscar}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10 w-full border border-gray-300 rounded-lg py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="bg-[#1E3A8A] text-white px-5 py-2.5 rounded-md text-sm cursor-pointer flex items-center gap-2 hover:bg-blue-700">
            <img
              src={Category}
              alt="Categoria"
              className=""
            />
            Categorias
          </button>
        </div>

        <div className='border border-gray-300 rounded-lg overflow-hidden'>
          <table className='w-full border-collapse'>
            <thead>
              <tr className="bg-[#1E3A8A] text-white">
                <th className="p-3 text-left text-sm font-medium">#</th>
                <th className="p-3 text-left text-sm font-medium">Nombre</th>
                <th className="p-3 text-left text-sm font-medium">Precio</th>
                <th className="p-3 text-left text-sm font-medium">Stock</th>
                <th className="p-3 text-left text-sm font-medium">Añadir</th>
              </tr>
            </thead>
            <tbody>
              {lista_productos.map((producto, index) => (
                <tr
                  key={producto.id}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b border-gray-200`}
                >
                  <td className="p-3 text-sm">{producto.id}</td>
                  <td className="p-3 text-sm">{producto.nombre}</td>
                  <td className="p-3 text-sm font-medium">${producto.precio}</td>
                  <td className="p-3 text-sm">
                    <span className={`font-medium ${getStock(producto.stock)}`}>● {producto.stock}</span>
                  </td>
                  <td className="p-3">
                    <button onClick={() => añadircarrito(producto)} className="bg-[#1E3A8A] text-white border-none rounded-full w-8 h-8 cursor-pointer flex items-center justify-center hover:bg-blue-700">
                      <img
                        src={shopping_cart}
                        alt="Agregar a carrito"
                        className="h-4 w-4"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex  justify-center items-center gap-2 mt-5">
          <button
            onClick={() => setPagina(1)}
            disabled={pagina === 1}
            className="px-3 py-2 border border-gray-300 bg-white cursor-pointer rounded disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
          >
            ≪
          </button>
          <button
            onClick={() => setPagina(Math.max(1, pagina - 1))}
            disabled={pagina === 1}
            className="px-3 py-2 border border-gray-300 bg-white cursor-pointer rounded disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
          >
            ‹
          </button>

          {[...Array(paginasTotales)].map((_, index) => {
            const Numero_pag = index + 1
            return (
              <button
                key={Numero_pag}
                onClick={() => setPagina(Numero_pag)}
                className={`px-3 py-2 border border-gray-300 cursor-pointer rounded min-w-9 ${
                  pagina === Numero_pag ? "bg-blue-600 text-white" : "bg-white text-black hover:bg-gray-50"
                }`}
              >
                {Numero_pag}
              </button>
            )
          })}

          <button
            onClick={() => setPagina(Math.min(paginasTotales, pagina + 1))}
            disabled={pagina === paginasTotales}
            className="px-3 py-2 border border-gray-300 bg-white cursor-pointer rounded disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
          >
            ›
          </button>
          <button
            onClick={() => setPagina(paginasTotales)}
            disabled={pagina === paginasTotales}
            className="px-3 py-2 border border-gray-300 bg-white cursor-pointer rounded disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
          >
            ≫
          </button>
        </div>
      </div>

      <div className="w-1/3 bg-white h-screen rounded-lg p-5 h-fit">
        <h2 className="text-2xl font-bold mb-5 text-gray-800">Carrito</h2>
        
        {carrito.length === 0 ? (
          <div className="text-center py-10 px-5 text-gray-600">
            <p className="text-base leading-6">¡Oh no parece que tu carrito esta vacío por que no intentas llenarlo!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-[60px_1fr_80px_40px] gap-2.5 bg-blue-600 text-white p-3 rounded-md mb-2.5 text-sm font-medium">
              <div>Cant.</div>
              <div>Nombre</div>
              <div>Precio</div>
              <div></div>
            </div>

            <div className="mb-5">
              {carrito.map((producto) => (
                <div
                  key={producto.id}
                  className="grid grid-cols-[60px_1fr_80px_40px] gap-2.5 p-3 border-b border-gray-200 items-center text-sm"
                >
                  <div className="text-center font-medium">{producto.cantidad}</div>
                  <div>{producto.nombre}</div>
                  <div className="font-medium">${(producto.precio * producto.cantidad).toFixed(2)}</div>
                  <button
                    onClick={() => eliminarcarrito(producto.id)}
                    className="bg-red-500 text-white border-none rounded w-6 h-6 cursor-pointer flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-gray-200 pt-4 mb-5">
              <div className="flex justify-between items-center text-base font-bold">
                <span>{totaldeproductos()} Artículos</span>
                <span>Total: ${preciototal().toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => setCarrito([])}
                className="flex-1 p-3 border border-gray-300 bg-white text-gray-600 rounded-md cursor-pointer text-sm hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button className="flex-[2] p-3 border-none bg-blue-600 text-white rounded-md cursor-pointer text-sm font-medium flex items-center justify-center gap-2 hover:bg-blue-700">
                Ir al Pago
                <span>›</span>
              </button>
            </div>
          </>
        )}

      </div>

    </div>
  )
}

export default NewSales
