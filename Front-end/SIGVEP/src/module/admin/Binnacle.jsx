import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Search from '../../assets/search1.svg';
import { AxiosClient } from '../../config/http-gateway/http-client';

function Binnacle() {
  const [search, setSearch] = useState('');
  const [first, setFirst] = useState(0);
  const [bitacora, setBitacora] = useState([]);
  const rows = 12;

  const fetchBitacora = async () => {
    try {
      const response = await AxiosClient.get('/bitacora');
      setBitacora(response || []);
    } catch (error) {
      setBitacora([]);
      console.error('Error al obtener bitácora:', error);
    }
  };

  useEffect(() => {
    fetchBitacora();
  }, []);

  const rowNumberTemplate = (rowData, { rowIndex }) => (
    <span>{rowIndex + 1}</span>
  );

  const fechaBodyTemplate = (rowData) => {
    if (!rowData.fechaHora) return '-';
    const fecha = new Date(rowData.fechaHora);
    return fecha.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const metodoBodyTemplate = (rowData) => {
    const metodo = rowData.metodoHttp || '';
    let colorClass = 'bg-gray-100 text-gray-800';
    
    switch (metodo.toUpperCase()) {
      case 'GET':
        colorClass = 'bg-blue-100 text-blue-800';
        break;
      case 'POST':
        colorClass = 'bg-green-100 text-green-800';
        break;
      case 'PUT':
        colorClass = 'bg-yellow-100 text-yellow-800';
        break;
      case 'PATCH':
        colorClass = 'bg-orange-100 text-orange-800';
        break;
      case 'DELETE':
        colorClass = 'bg-red-100 text-red-800';
        break;
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {metodo}
      </span>
    );
  };

  const filteredBitacora = bitacora.filter((b) => {
    const searchTerm = search.toLowerCase();
    return (
      (b.usuario || '').toLowerCase().includes(searchTerm) ||
      (b.metodoHttp || '').toLowerCase().includes(searchTerm) ||
      (b.endpoint || '').toLowerCase().includes(searchTerm) ||
      fechaBodyTemplate(b).toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="flex flex-col flex-1 w-full h-full">
      <div className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h1 className="text-2xl font-bold">Bitácora</h1>
        </div>
        <div className="mb-7 relative w-full">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <img src={Search} alt="Buscar" className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Buscar en bitácora..."
            value={search}
            onChange={e => { setSearch(e.target.value); setFirst(0); }}
            className="search-input"
            style={{ paddingLeft: '2rem' }}
          />
        </div>
        <div className="overflow-x-auto rounded-lg shadow bg-white">
          <DataTable
            value={filteredBitacora}
            paginator
            rows={rows}
            first={first}
            onPage={e => setFirst(e.first)}
            className="custom-datatable"
            emptyMessage={<span className="text-gray-500">No hay registros en la bitácora</span>}
          >
            <Column 
              body={rowNumberTemplate} 
              header="#" 
              style={{ width: '40px' }} 
            />
            <Column 
              field="endpoint" 
              header="Petición" 
              style={{ minWidth: '200px' }} 
            />
            <Column 
              body={fechaBodyTemplate} 
              header="Fecha y Hora" 
              style={{ minWidth: '180px' }} 
            />
            <Column 
              body={metodoBodyTemplate} 
              header="Método" 
              style={{ minWidth: '100px' }} 
            />
            <Column 
              field="usuario" 
              header="Usuario" 
              style={{ minWidth: '200px' }} 
            />
          </DataTable>
        </div>
      </div>
    </div>
  );
}

export default Binnacle;