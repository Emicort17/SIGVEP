import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import search_white from '../../assets/search_white.svg';
import search1 from '../../assets/search1.svg';
import Add from '../../assets/addw.svg';
import { AxiosClient } from '../../config/http-gateway/http-client';
import { useNavigate } from 'react-router-dom';
import SalesDetails from '../admin/components/SalesDetails';
import { alertaCargando, alertaError, alertaPregunta, alertaExito } from '../../config/context/alerts';

function Sales() {
  const navigate = useNavigate();
  const [buscar, setBuscar] = useState('');
  const [first, setFirst] = useState(0);
  const [registroVentas, setRegistroVentas] = useState([]);
  const [detalles, setDetalles] = useState(false);
  const [ventadetalles, setventadetalles] = useState(null);
  const rows = 8;

  useEffect(() => {
    Ventas();
  }, []);

  const Ventas = async () => {
    try {
      const response = await AxiosClient.get("/ventas");
      setRegistroVentas(response.data);
    } catch (error) {
      console.error('Error obteniendo ventas, ', error);
    }
  };

  const ventasOrdenadas = Array.isArray(registroVentas)
  ? [...registroVentas].sort((a, b) => new Date(b.date) - new Date(a.date))
  : [];

  const filteredSales = Array.isArray(ventasOrdenadas)
    ? ventasOrdenadas.filter(
      (venta) =>
        venta.user.id_usuario.toString().includes(buscar) ||
        venta.id_venta.toString().includes(buscar) ||
        venta.products.some(p => p.product.name.toLowerCase().includes(buscar.toLowerCase())) ||
        venta.user.nombre.toLowerCase().includes(buscar.toLowerCase())
    )
    : [];


  const detalles_venta = (id_venta) => {
    setventadetalles(id_venta);
    setDetalles(true);
  };

  const handleStatusChange = async (rowData) => {
    const nuevoStatus = !rowData.status;
    const pregunta = rowData.status
      ? "¿Deseas desactivar esta venta?"
      : "¿Deseas activar esta venta?";
    const confirm = await alertaPregunta(pregunta, "Esta acción cambiará el estado de la venta.");
    if (!confirm) return;
    alertaCargando("Actualizando estatus...", "Por favor, espere");
    try {
      await AxiosClient.patch(`/ventas/${rowData.id_venta}/status`, { status: nuevoStatus });
      alertaExito("Éxito", "El estatus de la venta se actualizó correctamente.");
      Ventas();
    } catch (error) {
      alertaError("Error", "No se pudo actualizar el estatus.");
      console.error("Error al actualizar estatus de venta: ", error);
    }
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

  const productsBodyTemplate = (rowData) => {
    if (!rowData.products || rowData.products.length === 0) return <span>Sin productos</span>;
    const names = rowData.products.map(p => p.product.name).join(', ');
    const maxLength = 40;
    const truncated = names.length > maxLength ? names.slice(0, maxLength) + '...' : names;
    return (
      <span className="truncate block max-w-xs" title={names}>
        {truncated}
      </span>
    );
  };

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
          ? 'text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-2 text-center me-2 mb-2 cursor-pointer'
          : 'text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-2 text-center me-2 mb-2 cursor-pointer'
      }
      onClick={() => handleStatusChange(rowData)}
      style={{ userSelect: 'none' }}
      title={rowData.status ? "Deshabilitar venta" : "Habilitar venta"}
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
            className="custom-blue-bottom text-white py-2 px-4 rounded-lg hover:bg-blue-900 transition cursor-pointer flex items-center gap-2 justify-center "
            onClick={() => navigate('/admin/new-sale')}
          >
            <img src={Add} alt="Agregar" className="w-5" />
            Añadir Venta
          </button>
        </div>
        <div className="mb-7 relative w-full">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <img src={search1} alt="Buscar" className="w-4 h-4" />
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
            <Column body={dateBodyTemplate} header="Fecha y Hora" style={{ minWidth: '140px' }} />
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