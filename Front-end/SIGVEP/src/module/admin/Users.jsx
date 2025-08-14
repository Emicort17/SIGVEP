import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Add from '../../assets/addw.svg';
import Edit from '../../assets/edit1.svg';
import EditW from '../../assets/editw.svg';
import Search from '../../assets/search1.svg';
import Filter from '../../assets/filter.svg';
import { AxiosClient } from '../../config/http-gateway/http-client';
import NewUserModal from './components/NewUserModal';
import EditUserInformationModal from './components/EditUserInformationModal';
import { alertaCargando, alertaError, alertaPregunta, alertaExito } from '../../config/context/alerts';

function Users() {
  const [search, setSearch] = useState('');
  const [first, setFirst] = useState(0);
  const [user, setUsers] = useState([]);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editUserData, setEditUserData] = useState(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [statusFilter, setStatusFilter] = useState('todos');
  const rows = 8;

  const fetchUsers = async () => {
    try {
      const response = await AxiosClient.get('/usuarios');
      const filtered = response.data?.filter(
        u => u.role?.name === "USER_ROLE"
      ) || [];
      setUsers(filtered);
    } catch (error) {
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const rowNumberTemplate = (rowData, { rowIndex }) => (
    <span>{rowIndex + 1}</span>
  );

  const actionBodyTemplate = (rowData) => (
    <button
      className="btn-edit-action group"
      onClick={() => {
        setEditUserData(rowData);
        setShowEditUserModal(true);
      }}
      title="Editar"
    >
      <img src={EditW} alt="Editar" className="icon-default w-4 h-4" />
      <img src={Edit} alt="Editar" className="icon-hover w-4 h-4" />
    </button>
  );

  const statusBodyTemplate = (rowData) => {
    const handleStatusChange = async () => {
      const nuevoStatus = !rowData.status;
      const pregunta = rowData.status
        ? "¿Deseas desactivar este usuario?"
        : "¿Deseas activar este usuario?";
      const confirm = await alertaPregunta(pregunta, "Esta acción cambiará el estado del usuario.");
      if (!confirm) return;
      alertaCargando("Actualizando estatus...", "Por favor, espere");
      try {
        await AxiosClient.patch(`/usuarios/${rowData.id_usuario}/status`, { status: nuevoStatus });
        alertaExito("Éxito", "El estatus del usuario se actualizó correctamente.");
        fetchUsers();
      } catch (error) {
        alertaError("Error", "No se pudo actualizar el estatus.");
        console.error("A chinga fallo por esto ", error)
      }
    };

    return (
      <span
        className={
          rowData.status
            ? 'text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-2 text-center me-2 mb-2 cursor-pointer'
            : 'text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-2 text-center me-2 mb-2 cursor-pointer'
        }
        onClick={handleStatusChange}
        style={{ userSelect: 'none' }}
        title={rowData.status ? "Deshabilitar usuario" : "Habilitar usuario"}
      >
        {rowData.status ? 'Habilitado' : 'Deshabilitado'}
      </span>
    );
  };

  const filteredUsers = user.filter((u) => {
  const matchesSearch =
    `${u.nombre || ''} ${u.apellido || ''}`.toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.telefono || '').includes(search);

  const matchesStatus =
    statusFilter === 'todos' ||
    (statusFilter === 'habilitado' && u.status === true) ||
    (statusFilter === 'deshabilitado' && u.status === false);

  return matchesSearch && matchesStatus;
});

  const fullNameBodyTemplate = (rowData) => (
    <span>
      {rowData.nombre || ''} {rowData.apellido || ''}
    </span>
  );

  const statusHeaderTemplate = () => (
  <div className="relative flex items-center gap-2">
    <span>Estatus</span>
    <button
      type="button"
      className="focus:outline-none px-2"
      onClick={e => {
        e.stopPropagation();
        setShowStatusDropdown((prev) => !prev);
      }}
      tabIndex={-1}
    >
      <img src={Filter} alt="Filtrar" className="w-4 h-4 cursor-pointer " />
    </button>
    {showStatusDropdown && (
      <div className="dropdown-absolute">
        <button
          className={`block w-full text-left px-2 py-1 mb-1 text-black hover:bg-blue-100 rounded cursor-pointer ${statusFilter === 'todos' ? 'font-bold text-blue-800' : ''}`}
          onClick={() => { setStatusFilter('todos'); setShowStatusDropdown(false); }}
        >
          Todos
        </button>
        <button
          className={`block w-full text-left px-2 py-1 mb-1 text-black hover:bg-blue-100 rounded cursor-pointer ${statusFilter === 'habilitado' ? 'font-bold text-green-700' : ''}`}
          onClick={() => { setStatusFilter('habilitado'); setShowStatusDropdown(false); }}
        >
          Habilitado
        </button>
        <button
          className={`block w-full text-left px-2 py-1 mb-1 text-black hover:bg-blue-100 rounded cursor-pointer ${statusFilter === 'deshabilitado' ? 'font-bold text-red-700' : ''}`}
          onClick={() => { setStatusFilter('deshabilitado'); setShowStatusDropdown(false); }}
        >
          Deshabilitado
        </button>
      </div>
    )}
  </div>
);

  return (
    <div className="flex flex-col flex-1 w-full h-full">
      <div className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h1 className="text-2xl font-bold">Usuarios</h1>
          <button
            className="custom-blue-bottom text-white py-2 px-4 rounded-lg hover:bg-blue-900 transition cursor-pointer flex items-center gap-2 justify-center "
            onClick={() => setShowNewUserModal(true)}
          >
            <img src={Add} alt="Agregar" className="w-5" />
            Nuevo Usuario
          </button>
        </div>
        <div className="mb-7 relative w-full">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <img src={Search} alt="Buscar" className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={search}
            onChange={e => { setSearch(e.target.value); setFirst(0); }}
            className="search-input"
            style={{ paddingLeft: '2rem' }}
          />
        </div>
        <div className="overflow-x-auto rounded-lg shadow bg-white">
          <DataTable
            value={filteredUsers}
            paginator
            rows={rows}
            first={first}
            onPage={e => setFirst(e.first)}
            className="custom-datatable"
            emptyMessage={<span className="text-gray-500">No hay usuarios</span>}
          >
            <Column body={rowNumberTemplate} header="#" style={{ width: '40px' }} />
            <Column body={fullNameBodyTemplate} header="Nombre Completo" style={{ minWidth: '200px' }} />
            <Column field="email" header="Correo Electrónico" style={{ minWidth: '200px' }} />
            <Column field="telefono" header="Teléfono" style={{ minWidth: '120px' }} />
            <Column field="status" header={statusHeaderTemplate} body={statusBodyTemplate} style={{ minWidth: '120px', }} />
            <Column header="Acción" body={actionBodyTemplate} style={{ minWidth: '100px', textAlign: 'center' }} />
          </DataTable>
        </div>
      </div>
      {showNewUserModal && (
        <NewUserModal
          isOpen={showNewUserModal}
          onClose={() => setShowNewUserModal(false)}
          onSuccess={() => {
            setShowNewUserModal(false);
            fetchUsers();
            setSearch('');
          }}
        />
      )}
      {showEditUserModal && editUserData && (
        <EditUserInformationModal
          isOpen={showEditUserModal}
          onClose={() => setShowEditUserModal(false)}
          userData={editUserData}
          onSuccess={() => {
            setShowEditUserModal(false);
            setEditUserData(null);
            fetchUsers();
            setSearch('');
          }}
        />
      )}
    </div>
  );
}

export default Users;
