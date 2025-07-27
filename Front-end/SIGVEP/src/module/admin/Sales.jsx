import React, { useState, useEffect } from 'react';
import search_white from '../../assets/search_white.svg';
import { AxiosClient } from '../../config/http-gateway/http-client';
import SalesDetails from '../admin/components/SalesDetails'

function Sales() {
  const [buscar, setBuscar] = useState('');
  const [pagina, setPagina] = useState(1);
  const [registroVentas, setRegistroVentas] = useState([]);
  const [detalles, setDetalles] = useState(false);
  const [ventadetalles, setventadetalles] = useState(null);

  useEffect(() => {
    Ventas();
  }, []);

  const Ventas = async () => {
    try {
      const response = await AxiosClient.get("http://localhost:8000/api/ventas");
      setRegistroVentas(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error obteniendo productos, ', error);
    }
  };

  const filtradas = Array.isArray(registroVentas)
    ? registroVentas.filter(
      (venta) =>
        venta.user.id_usuario.toString().includes(buscar) ||
        venta.id_venta.toString().includes(buscar) ||
        venta.user.nombre.toLowerCase().includes(buscar.toLowerCase()),
    )
    : []

  const porPagina = 10;
  const paginasTotales = Math.ceil(filtradas.length / porPagina);
  const inicio = (pagina - 1) * porPagina;
  const listaActual = filtradas.slice(inicio, inicio + porPagina);

  const detalles_venta = (id_venta) => {
    console.log("ID recibido en detalles_venta:", id_venta)
    console.log("Tipo de ID:", typeof id_venta)

    setventadetalles(id_venta)
    setDetalles(true)

    setTimeout(() => {
      console.log("Estado ventadetalles después de set:", id_venta)
    }, 100)
  }

  return (
    <div className="w-full px-4 mt-5 mb-10">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold mb-4">Ventas</h1>
        <button className="bg-[#1E3A8A] hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 self-start sm:self-auto">
          + Añadir Venta
        </button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full">
          <img
            src={search_white}
            alt="Buscar"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60"
          />
          <input
            type="text"
            placeholder="Buscar..."
            value={buscar}
            onChange={(e) => {
              setBuscar(e.target.value);
              setPagina(1);
            }}
            className="pl-10 w-full border border-gray-300 rounded-lg py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full min-w-full table-auto">
          <thead className="bg-[#1E3A8A] text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">#</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Usuario</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Productos</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Total</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Fecha</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {listaActual.map((venta, index) => (
              <tr
                key={venta.id_venta}
                className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="px-4 py-3 text-sm text-gray-900">{venta.id_venta}</td>
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                  <div className="truncate max-w-[200px]" title={venta.user.id_usuario}>
                    {venta.user.nombre}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {venta.products && venta.products.length > 0
                    ? venta.products.map(p => p.product.name).join(', ')
                    : 'Sin productos'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">${venta.total_sale}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{venta.date}</td>
                <td className="px-4 py-3">
                  <div className="bg-green-100 text-green-800 w-min h-min rounded-lg border border-green-200 px-2 py-1">
                    {venta.status ? 'Habilitado' : 'Deshabilitado'}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => detalles_venta(venta.id_venta)}
                    className="bg-[#1E3A8A] hover:bg-blue-700 text-white rounded-full h-8 w-8 p-0 flex items-center justify-center">
                    <img src={search_white} alt="Buscar" className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {detalles && (
          <SalesDetails
            isOpen={detalles}
            saleId={ventadetalles}
            onClose={() => setDetalles(false)}
          />
        )}

        <div className="flex justify-center items-center gap-2 mt-5 mb-5">
          <button
            onClick={() => setPagina(1)}
            disabled={pagina === 1}
            className="px-3 py-2 border border-gray-300 bg-white rounded disabled:opacity-50 hover:bg-gray-50"
          >
            ≪
          </button>
          <button
            onClick={() => setPagina(Math.max(1, pagina - 1))}
            disabled={pagina === 1}
            className="px-3 py-2 border border-gray-300 bg-white rounded disabled:opacity-50 hover:bg-gray-50"
          >
            ‹
          </button>
          {[...Array(paginasTotales)].map((_, index) => {
            const Numero_pag = index + 1;
            return (
              <button
                key={Numero_pag}
                onClick={() => setPagina(Numero_pag)}
                className={`px-3 py-2 border border-gray-300 rounded min-w-9 ${pagina === Numero_pag
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-black hover:bg-gray-50'
                  }`}
              >
                {Numero_pag}
              </button>
            );
          })}
          <button
            onClick={() => setPagina(Math.min(paginasTotales, pagina + 1))}
            disabled={pagina === paginasTotales}
            className="px-3 py-2 border border-gray-300 bg-white rounded disabled:opacity-50 hover:bg-gray-50"
          >
            ›
          </button>
          <button
            onClick={() => setPagina(paginasTotales)}
            disabled={pagina === paginasTotales}
            className="px-3 py-2 border border-gray-300 bg-white rounded disabled:opacity-50 hover:bg-gray-50"
          >
            ≫
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sales;
