import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Add from '../../assets/addw.svg';
import Search from '../../assets/search1.svg';
import Filter from '../../assets/filter.svg';
import { useNavigate } from 'react-router-dom';
import { AxiosClient } from '../../config/http-gateway/http-client';
import { alertaCargando, alertaError, alertaPregunta, alertaExito } from '../../config/context/alerts';

function ProductsU() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [first, setFirst] = useState(0);
  const [products, setProducts] = useState([]);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [statusFilter, setStatusFilter] = useState('todos');
  const [showStockDropdown, setShowStockDropdown] = useState(false);
  const [stockFilter, setStockFilter] = useState('todos');
  const rows = 8;

  const fetchProducts = async () => {
    try {
      const response = await AxiosClient.get('/productos/');
      setProducts(response.data || []);
    } catch (error) {
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const rowNumberTemplate = (rowData, { rowIndex }) => (
    <span>{rowIndex + 1}</span>
  );

  const statusBodyTemplate = (rowData) => (
  <span
    className={
      rowData.status
        ? 'text-green-700 border border-green-700 bg-green-50 font-medium rounded-lg text-sm px-2 py-2 text-center me-2 mb-2'
        : 'text-red-700 border border-red-700 bg-red-50 font-medium rounded-lg text-sm px-2 py-2 text-center me-2 mb-2'
    }
    style={{ userSelect: 'none', cursor: 'default' }}
    title={rowData.status ? "Producto habilitado" : "Producto deshabilitado"}
  >
    {rowData.status ? 'Habilitado' : 'Deshabilitado'}
  </span>
);

  const priceBodyTemplate = (rowData) => (
    <span>${rowData.unit_price?.toFixed(2) || '0.00'}</span>
  );

  const stockBodyTemplate = (rowData) => (
    <div className="flex items-center gap-2">
      <div
        className={`w-2 h-2 rounded-full ${rowData.stock < 30 ? 'bg-red-500' : 'bg-green-500'
          }`}
      />
      <span
        className={rowData.stock < 30 ? 'text-red-600' : 'text-green-600'}
      >
        {rowData.stock || 0}
      </span>
    </div>
  );

  const categoryBodyTemplate = (rowData) => (
    <span>{rowData.category?.name || 'Sin categoría'}</span>
  );

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.category?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.unit_price?.toString() || '').includes(search);

    const matchesStatus =
      statusFilter === 'todos' ||
      (statusFilter === 'habilitado' && p.status === true) ||
      (statusFilter === 'deshabilitado' && p.status === false);

    const matchesStock =
      stockFilter === 'todos' ||
      (stockFilter === 'bajo' && p.stock < 30) ||
      (stockFilter === 'normal' && p.stock >= 30);

    return matchesSearch && matchesStatus && matchesStock;
  });

  const statusHeaderTemplate = () => (
    <div className="relative flex items-center gap-2">
      <span>Estado</span>
      <button
        type="button"
        className="focus:outline-none px-2"
        onClick={e => {
          e.stopPropagation();
          setShowStatusDropdown((prev) => !prev);
        }}
        tabIndex={-1}
      >
        <img src={Filter} alt="Filtrar" className="w-4 h-4 cursor-pointer" />
      </button>
      {showStatusDropdown && (
        <div className="absolute right-0 top-8 z-50 bg-white border rounded shadow p-2 min-w-[120px]">
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

  const stockHeaderTemplate = () => (
    <div className="relative flex items-center gap-2">
      <span>Stock</span>
      <button
        type="button"
        className="focus:outline-none px-2"
        onClick={e => {
          e.stopPropagation();
          setShowStockDropdown((prev) => !prev);
        }}
        tabIndex={-1}
      >
        <img src={Filter} alt="Filtrar" className="w-4 h-4 cursor-pointer" />
      </button>
      {showStockDropdown && (
        <div className="absolute right-0 top-8 z-50 bg-white border rounded shadow p-2 min-w-[120px]">
          <button
            className={`block w-full text-left px-2 py-1 mb-1 text-black hover:bg-blue-100 rounded cursor-pointer ${stockFilter === 'todos' ? 'font-bold text-blue-800' : ''}`}
            onClick={() => { setStockFilter('todos'); setShowStockDropdown(false); }}
          >
            Todos
          </button>
          <button
            className={`block w-full text-left px-2 py-1 mb-1 text-black hover:bg-blue-100 rounded cursor-pointer ${stockFilter === 'bajo' ? 'font-bold text-red-700' : ''}`}
            onClick={() => { setStockFilter('bajo'); setShowStockDropdown(false); }}
          >
            Stock Bajo
          </button>
          <button
            className={`block w-full text-left px-2 py-1 mb-1 text-black hover:bg-blue-100 rounded cursor-pointer ${stockFilter === 'normal' ? 'font-bold text-green-700' : ''}`}
            onClick={() => { setStockFilter('normal'); setShowStockDropdown(false); }}
          >
            Stock Normal
          </button>
        </div>
      )}
    </div>
  );

  useEffect(() => {
    if (!showStatusDropdown) return;
    const handleClick = () => setShowStatusDropdown(false);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [showStatusDropdown]);

  useEffect(() => {
    if (!showStockDropdown) return;
    const handleClick = () => setShowStockDropdown(false);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [showStockDropdown]);

  return (
    <div className="flex flex-col flex-1 w-full h-full">
      <div className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h1 className="text-2xl font-bold">Productos</h1>
          <button
            className="custom-blue-bottom text-white py-2 px-4 rounded-lg hover:bg-blue-900 transition cursor-pointer flex items-center gap-2 justify-center "
            onClick={() => navigate('/user/new-sale')}
          >
            <img src={Add} alt="Agregar" className="w-5" />
            Nueva Venta
          </button>
        </div>
        <div className="mb-7 relative w-full">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <img src={Search} alt="Buscar" className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={e => { setSearch(e.target.value); setFirst(0); }}
            className="search-input"
            style={{ paddingLeft: '2rem' }}
          />
        </div>
        <div className="overflow-x-auto rounded-lg shadow bg-white">
          <DataTable
            value={filteredProducts}
            paginator
            rows={rows}
            first={first}
            onPage={e => setFirst(e.first)}
            className="custom-datatable"
            emptyMessage={<span className="text-gray-500">No hay productos</span>}
            rowClassName={() => 'custom-row-spacing'}
          >
            <Column body={rowNumberTemplate} header="#" style={{ width: '40px' }} />
            <Column field="clave" header="Clave" style={{ minWidth: '80px' }} />
            <Column field="name" header="Nombre" style={{ minWidth: '180px' }} />
            <Column body={priceBodyTemplate} header="Precio" style={{ minWidth: '100px' }} />
            <Column body={stockBodyTemplate} header={stockHeaderTemplate} style={{ minWidth: '80px' }} />
            <Column body={categoryBodyTemplate} header="Categoría" style={{ minWidth: '170px' }} />
            <Column field="status" header={statusHeaderTemplate} body={statusBodyTemplate} style={{ minWidth: '120px' }} />
          </DataTable>
        </div>
      </div>
    </div>
  );
}

export default ProductsU;