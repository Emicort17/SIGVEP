import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const mockUsers = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  nombre: 'Victor Alejandro Oliva Quiroz',
  correo: 'victor.alejandro@gmail.com',
  telefono: '7772693860',
  estatus: i % 3 === 0 ? 'Deshabilitado' : 'Habilitado',
}));

const statusBodyTemplate = (rowData) => (
  <span className={
    rowData.estatus === 'Habilitado'
      ? 'bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold'
      : 'bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold'
  }>
    {rowData.estatus}
  </span>
);

const actionBodyTemplate = () => (
  <button className="bg-custom-blue hover:bg-blue-900 text-white p-2 rounded-full transition">
    Editar
  </button>
);

const rowNumberTemplate = (rowData, { rowIndex }) => (
  <span>{rowIndex + 1}</span>
);

function Users() {
  const [search, setSearch] = useState('');
  const [first, setFirst] = useState(0);
  const rows = 6;

  const filteredUsers = mockUsers.filter(
    (u) =>
      u.nombre.toLowerCase().includes(search.toLowerCase()) ||
      u.correo.toLowerCase().includes(search.toLowerCase()) ||
      u.telefono.includes(search)
  );

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <button className="flex items-center gap-2 bg-custom-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-900 transition text-sm">
          Nuevo Usuario
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={search}
          onChange={e => { setSearch(e.target.value); setFirst(0); }}
          className="w-full sm:w-1/2 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>
      <div className="overflow-x-auto rounded-lg shadow">
        <DataTable
          value={filteredUsers}
          paginator
          rows={rows}
          first={first}
          onPage={e => setFirst(e.first)}
          className="custom-datatable"
          emptyMessage={<span className="text-gray-500">No hay usuarios</span>}
        >
          <Column body={rowNumberTemplate} header="#" style={{ width: '40px' }}></Column>
          <Column field="nombre" header="Nombre Completo" style={{ minWidth: '200px' }}></Column>
          <Column field="correo" header="Correo Electrónico" style={{ minWidth: '200px' }}></Column>
          <Column field="telefono" header="Teléfono" style={{ minWidth: '120px' }}></Column>
          <Column field="estatus" header="Estatus" body={statusBodyTemplate} style={{ minWidth: '120px' }}></Column>
          <Column header="Acción" body={actionBodyTemplate} style={{ minWidth: '100px', textAlign: 'center' }}></Column>
        </DataTable>
      </div>
    </div>
  );
}

export default Users;
