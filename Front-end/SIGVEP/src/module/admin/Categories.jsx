import React, { useState, useEffect } from 'react';
import { Paginator } from 'primereact/paginator';
import Add from '../../assets/addw.svg';
import EditW from '../../assets/editw.svg';
import Search from '../../assets/search1.svg';
import CategoriaW from '../../assets/categoryw.svg';
import { AxiosClient } from '../../config/http-gateway/http-client';
import { alertaCargando, alertaError, alertaExito, alertaPregunta } from '../../config/context/alerts';
import NewCategoryModal from './components/NewCategoryModal';
import EditCategoryModal from './components/EditCategoryModal';

function Categories() {
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [first, setFirst] = useState(0);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const rows = 6;

  const fetchCategories = async () => {
    try {
      const response = await AxiosClient.get('/categorias/');
      setCategories(response.data || []);
    } catch (error) {
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(c =>
    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.description || '').toLowerCase().includes(search.toLowerCase())
  );

  const cardTemplate = (category) => {
    const handleStatusChange = async () => {
      const nuevoStatus = !category.status;
      const pregunta = category.status
        ? "¿Deseas desactivar esta categoría?"
        : "¿Deseas activar esta categoría?";
      const confirm = await alertaPregunta(pregunta, "Esta acción cambiará el estado de la categoría.");
      if (!confirm) return;
      alertaCargando("Actualizando estatus...", "Por favor, espere");
      try {
        await AxiosClient.patch(`/categorias/${category.id_category}`, { status: nuevoStatus });
        alertaExito("Éxito", "El estatus de la categoría se actualizó correctamente.");
        fetchCategories();
      } catch (error) {
        alertaError("Error", "No se pudo actualizar el estatus.");
      }
    };

    return (
      <div className="bg-white rounded-lg shadow-md flex flex-col items-center p-6 pt-16 relative" style={{ minHeight: 240 }}>
        <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-24 h-12 bg-custom-blue rounded-b-full flex items-center justify-center">
          <img src={CategoriaW} alt="Categoría" className="w-7 h-7" />
        </div>
        <div className="flex flex-col flex-1 w-full justify-between">
          <div className="text-center mb-4">
            <div className="font-bold text-2xl custom-blue mb-2">{category.name}</div>
            <div className="text-gray-700 text-base">{category.description}</div>
          </div>
          <div className="flex w-full justify-between items-end mt-auto pt-2">
            <span
              className={
                category.status
                  ? 'text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-2 text-center cursor-pointer'
                  : 'text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-2 text-center cursor-pointer'
              }
              onClick={handleStatusChange}
              style={{ userSelect: 'none' }}
              title={category.status ? "Deshabilitar categoría" : "Habilitar categoría"}
            >
              {category.status ? 'Habilitado' : 'Deshabilitado'}
            </span>
            <button
              className="custom-blue-bottom flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium hover:bg-blue-900 transition cursor-pointer shadow text-sm"
              title="Editar"
              onClick={() => {
                setSelectedCategory(category);
                setShowEditCategoryModal(true);
              }}
            >
              <img src={EditW} alt="Editar" className="icon-default w-4 h-4" />
              <span>Editar</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const paginatedCategories = filteredCategories.slice(first, first + rows);

  return (
    <div className="flex flex-col flex-1 w-full h-full">
      <div className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h1 className="text-2xl font-bold">Categorías</h1>
          <button
            className="custom-blue-bottom text-white py-2 px-4 rounded-lg hover:bg-blue-900 transition cursor-pointer flex items-center gap-2 justify-center"
            onClick={() => setShowNewCategoryModal(true)}
          >
            <img src={Add} alt="Agregar" className="w-5" />
            Nueva Categoría
          </button>
        </div>
        <div className="mb-4 relative w-full">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <img src={Search} alt="Buscar" className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Buscar categoría..."
            value={search}
            onChange={e => { setSearch(e.target.value); setFirst(0); }}
            className="search-input"
            style={{ paddingLeft: '2rem' }}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {paginatedCategories.map(category => (
            <div key={category.id_category}>
              {cardTemplate(category)}
            </div>
          ))}
        </div>
        <div className="flex justify-center custom-datatable">
          <Paginator
            first={first}
            rows={rows}
            totalRecords={filteredCategories.length}
            onPageChange={e => setFirst(e.first)}
            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
          />
        </div>
      </div>
      {showNewCategoryModal && (
        <NewCategoryModal
          isOpen={showNewCategoryModal}
          onClose={() => setShowNewCategoryModal(false)}
          onSuccess={() => {
            setShowNewCategoryModal(false);
            fetchCategories();
          }}
        />
      )}
      {showEditCategoryModal && selectedCategory && (
        <EditCategoryModal
          isOpen={showEditCategoryModal}
          onClose={() => setShowEditCategoryModal(false)}
          categoryData={selectedCategory}
          onSuccess={() => {
            setShowEditCategoryModal(false);
            setSelectedCategory(null);
            fetchCategories();
          }}
        />
      )}
    </div>
  );
}

export default Categories;