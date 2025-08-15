import React, { useState, useEffect } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Close from "../../../assets/closeb.svg";
import { AxiosClient } from "../../../config/http-gateway/http-client";

function SalesDetails({ isOpen, onClose, saleId }) {
  const [saleDetails, setSaleDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const rows = 5;

  useEffect(() => {
    if (saleId && isOpen) {
      fetchSaleDetails(saleId);
    }
    if (!isOpen) {
      setSaleDetails(null);
      setError(null);
    }
  }, [saleId, isOpen]);

  const fetchSaleDetails = async (id_venta) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AxiosClient.get(`/ventas/${id_venta}`);
      setSaleDetails(response.data);
    } catch (error) {
      setError("Error al cargar los detalles de la venta");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-4xl mx-auto p-6" style={{ maxHeight: "90vh", overflowY: "auto" }}>

        <div className="absolute top-4 right-4">
          <button onClick={onClose} className="cursor-pointer">
            <img src={Close} alt="Cerrar" className="w-6 h-6" />
          </button>
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 font-poppins custom-blue">
          Detalles de Venta
        </h2>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-700">Cargando...</span>
          </div>
        )}
        {error && (
          <div className="text-center text-red-600 mb-4">{error}</div>
        )}

        {saleDetails && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-6">
              <div>
                <span className="font-medium text-gray-700">No. Venta:</span>
                <span className="text-gray-900 ml-2">{saleDetails.id_venta}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Tipo de Pago:</span>
                <span className="text-gray-900 ml-2">{saleDetails.payment_type}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Fecha:</span>
                <span className="text-gray-900 ml-2">{saleDetails.date}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Total:</span>
                <span className="text-gray-900 ml-2 font-semibold">
                  ${saleDetails.total_sale?.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="font-medium text-gray-700">Vendedor:</span>
                <span className="text-gray-900 ml-2">
                  {saleDetails.user?.nombre} {saleDetails.user?.apellido}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <DataTable
                value={saleDetails.products}
                paginator
                rows={rows}
                className="custom-datatable"
                emptyMessage={<span className="text-gray-500">No hay productos</span>}
                responsiveLayout="scroll"
              >
                <Column
                  header="#"
                  body={(_, { rowIndex }) => <span>{rowIndex + 1}</span>}
                  style={{ width: '40px' }}
                />
                <Column
                  header="Clave"
                  body={rowData => (
                    <span className="truncate block max-w-xs" title={rowData.product.clave}>
                      {rowData.product.clave}
                    </span>
                  )}
                  style={{ minWidth: '100px' }}
                />
                <Column
                  header="Producto"
                  body={rowData => (
                    <span className="truncate block max-w-xs" title={rowData.product.name}>
                      {rowData.product.name}
                    </span>
                  )}
                  style={{ minWidth: '160px' }}
                />
                <Column
                  header="Categoría"
                  body={rowData => rowData.product.category.name}
                  style={{ minWidth: '120px' }}
                />
                <Column
                  header="Cantidad"
                  body={rowData => rowData.quantity}
                  style={{ minWidth: '80px', textAlign: 'center' }}
                />
                <Column
                  header="Precio"
                  body={rowData => `$${rowData.product.unit_price?.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`}
                  style={{ minWidth: '100px' }}
                />
              </DataTable>
            </div>
            <div className="flex justify-end mt-2">
              <button
                onClick={onClose}
                className="bg-gray-100 hover:bg-gray-300 text-gray-700 font-medium rounded-lg px-5 py-2 w-32 cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SalesDetails;