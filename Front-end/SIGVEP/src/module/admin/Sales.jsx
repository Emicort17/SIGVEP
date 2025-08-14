import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import search_white from '../../assets/search_white.svg';
import search1 from '../../assets/search1.svg';
import { AxiosClient } from '../../config/http-gateway/http-client';
import { useNavigate } from 'react-router-dom';
import SalesDetails from '../admin/components/SalesDetails';

function Sales() {
  const navigate = useNavigate();
  const [buscar, setBuscar] = useState('');
  const [first, setFirst] = useState(0);
  const [registroVentas, setRegistroVentas] = useState([]);
  const [detalles, setDetalles] = useState(false);
  const [ventadetalles, setventadetalles] = useState(null);
  const rows = 10;

  useEffect(() => {
    Ventas();
  }, []);

  const Ventas = async () => {
    try {
      const response = await AxiosClient.get("http://localhost:8000/api/ventas");
      setRegistroVentas(response.data);
    } catch (error) {
      console.error('Error obteniendo ventas, ', error);
    }
  };

  const filteredSales = Array.isArray(registroVentas)
    ? registroVentas.filter(
      (venta) =>
        venta.user.id_usuario.toString().includes(buscar) ||
        venta.id_venta.toString().includes(buscar) ||
        venta.user.nombre.toLowerCase().includes(buscar.toLowerCase())
    )
    : [];

  const detalles_venta = (id_venta) => {
    setventadetalles(id_venta);
    setDetalles(true);
  };

  // Column templates
  const rowNumberTemplate = (rowData, { rowIndex }) => (
    <span>{rowIndex + 1 + first}</span>
  );

  const userBodyTemplate = (rowData) => (
    <div className="truncate max-w-[200px]" title={rowData.user.id_usuario}>
      {rowData.user.nombre}
    </div>
  );

  const productsBodyTemplate = (rowData) => (
    <span>
      {rowData.products && rowData.products.length > 0
        ? rowData.products.map(p => p.product.name).join(', ')
        : 'Sin productos'}
    </span>
  );

  const totalBodyTemplate = (rowData) => (
    <span>${rowData.total_sale}</span>
  );

  const dateBodyTemplate = (rowData) => (
    <span>{rowData.date}</span>
  );

  const statusBodyTemplate = (rowData) => (
    <span
      className={
        rowData.status
          ? 'text-green-700 border border-green-700 bg-green-50 font-medium rounded-lg text-sm px-2 py-2 text-center me-2 mb-2'
          : 'text-red-700 border border-red-700 bg-red-50 font-medium rounded-lg text-sm px-2 py-2 text-center me-2 mb-2'
      }
      style={{ userSelect: 'none', cursor: 'default' }}
      title={rowData.status ? "Venta habilitada" : "Venta deshabilitada"}
    >
      {rowData.status ? 'Habilitado' : 'Deshabilitado'}
    </span>
  );

  const actionBodyTemplate = (rowData) => (
    <button
      className="btn-edit-action group"
      onClick={() => detalles_venta(rowData.id_venta)}
      title="Ver detalles"
    >
      <img src={search_white} alt="Detalles" className="icon-default w-4 h-4" />
      <img src={search1} alt="Detalles" className="icon-hover w-4 h-4" />
    </button>
  );

  return (
    <div className="flex flex-col flex-1 w-full h-full">
      <div className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h1 className="text-2xl font-bold">Ventas</h1>
          <button
            onClick={() => navigate('/admin/new-sale')}
            className="custom-blue-bottom text-white py-2 px-4 rounded-lg hover:bg-blue-900 transition cursor-pointer flex items-center gap-2 justify-center"
          >
            <span className="text-lg font-bold">+</span>
            Añadir Venta
          </button>
        </div>
        <div className="mb-7 relative w-full">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <img src={search_white} alt="Buscar" className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Buscar venta..."
            value={buscar}
            onChange={(e) => {
              setBuscar(e.target.value);
              setFirst(0);
            }}
            className="search-input"
            style={{ paddingLeft: '2rem' }}
          />
        </div>
        <div className="overflow-x-auto rounded-lg shadow bg-white">
          <DataTable
            value={filteredSales}
            paginator
            rows={rows}
            first={first}
            onPage={e => setFirst(e.first)}
            className="custom-datatable"
            emptyMessage={<span className="text-gray-500">No hay ventas</span>}
            rowClassName={() => 'custom-row-spacing'}
          >
            <Column body={rowNumberTemplate} header="#" style={{ width: '40px' }} />
            <Column body={userBodyTemplate} header="Usuario" style={{ minWidth: '200px' }} />
            <Column body={productsBodyTemplate} header="Productos" style={{ minWidth: '200px' }} />
            <Column body={totalBodyTemplate} header="Total" style={{ minWidth: '100px' }} />
            <Column body={dateBodyTemplate} header="Fecha" style={{ minWidth: '140px' }} />
            <Column body={statusBodyTemplate} header="Estado" style={{ minWidth: '120px' }} />
            <Column body={actionBodyTemplate} header="Acción" style={{ minWidth: '100px', textAlign: 'center' }} />
          </DataTable>
        </div>
        {detalles && (
          <SalesDetails
            isOpen={detalles}
            saleId={ventadetalles}
            onClose={() => setDetalles(false)}
          />
        )}
      </div>
    </div>
  );
}

export default Sales;