import React, { useState, useEffect } from "react";
import { AxiosClient } from '../../../config/http-gateway/http-client';

function SalesDetails({ isOpen, onClose, saleId }) {
    const [currentPage, setCurrentPage] = useState(1)
    const [saleDetails, setSaleDetails] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchSaleDetails = async (id_venta) => {
        setLoading(true)
        setError(null)
        try {
            const response = await AxiosClient.get(`http://localhost:8000/api/ventas/${id_venta}`)
            setSaleDetails(response.data)
            console.log("Sale details:", response.data)
        } catch (error) {
            console.error("Error obteniendo detalles de venta:", error)
            setError("Error al cargar los detalles de la venta")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (saleId && isOpen) {
            fetchSaleDetails(saleId)
            setCurrentPage(1)
        }
    }, [saleId, isOpen])

    useEffect(() => {
        if (!isOpen) {
            setCurrentPage(1)
            setSaleDetails(null)
            setError(null)
        }
    }, [isOpen])

    if (!isOpen) return null

    if (loading) {
        return (
            <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-700">Cargando...</span>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (!saleDetails) {
        return (
            <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
                    <div className="text-center">
                        <p className="text-gray-600 mb-4">No se encontraron detalles de la venta</p>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Pagination logic
    const itemsPerPage = 5
    const products = saleDetails.products || []
    const totalPages = Math.ceil(products.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const currentProducts = products.slice(startIndex, startIndex + itemsPerPage)

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        })
    }

    return (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                    <h2 className="text-lg font-semibold text-gray-800">Detalles de Venta</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl font-bold w-6 h-6 flex items-center justify-center transition-colors"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                    {/* Sale Information Grid */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
                        <div className="flex">
                            <span className="font-medium text-gray-700 w-20">No. Venta:</span>
                            <span className="text-gray-900 ml-4">{saleDetails.id_venta}</span>
                        </div>
                        <div className="flex">
                            <span className="font-medium text-gray-700 w-24">Tipo de Pago:</span>
                            <span className="text-gray-900 ml-4">{saleDetails.payment_type}</span>
                        </div>
                        <div className="flex">
                            <span className="font-medium text-gray-700 w-20">Fecha:</span>
                            <span className="text-gray-900 ml-4">{formatDate(saleDetails.date)}</span>
                        </div>
                        <div className="flex">
                            <span className="font-medium text-gray-700 w-24">Total:</span>
                            <span className="text-gray-900 ml-4 font-semibold">
                                ${saleDetails.total_sale.toLocaleString("es-MX", { minimumFractionDigits: 0 })}
                            </span>
                        </div>
                        <div className="flex col-span-2">
                            <span className="font-medium text-gray-700 w-20">Vendedor:</span>
                            <span className="text-gray-900 ml-4">
                                {saleDetails.user.nombre} {saleDetails.user.apellido}
                            </span>
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-blue-600 text-white">
                                    <th className="px-4 py-3 text-left text-sm font-medium">#</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Producto</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Categoría</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Cantidad</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Precio</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentProducts.map((item, index) => (
                                    <tr key={item.product.id_product} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-900">{startIndex + index + 1}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{item.product.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{item.product.category.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900 text-center">{item.quantity}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            ${item.product.unit_price.toLocaleString("es-MX", { minimumFractionDigits: 0 })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-1 mt-6">
                            <button
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                                className="px-2 py-1 text-sm border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                ≪
                            </button>

                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="px-2 py-1 text-sm border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                ‹
                            </button>

                            {[...Array(totalPages)].map((_, index) => {
                                const pageNum = index + 1
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`px-3 py-1 text-sm border transition-colors ${currentPage === pageNum
                                                ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                )
                            })}

                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="px-2 py-1 text-sm border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                ›
                            </button>

                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                                className="px-2 py-1 text-sm border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                ≫
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SalesDetails;