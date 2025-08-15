import React, { useState, useEffect } from 'react';
import Close from '../../../assets/closeb.svg';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { alertaCargando, alertaError, alertaExito, alertaPregunta } from '../../../config/context/alerts';
import { AxiosClient } from '../../../config/http-gateway/http-client';

function NewProductModal({ isOpen, onClose, onSuccess }) {
    const labelStyles = "block mb-2 text-base custom-blue font-medium text-gray-900";
    const inputStyles = "bg-custom-bluelight border-t-0 border-x-0 text-gray-900 text-sm rounded-lg focus:ring-0 block w-full ps-3 p-2.5 custom-border-bottom";
    const selectStyles = "bg-custom-bluelight border-t-0 border-x-0 text-gray-900 text-sm rounded-lg focus:ring-0 block w-full ps-3 p-2.5 custom-border-bottom";

    const [categories, setCategories] = useState([]);

    const validationSchema = yup.object({
        clave: yup.
            string()
            .test(
                "no-spaces",
                "No se permiten espacios al inicio o final",
                value => value === undefined || (value === value?.trim())
            )
            .required("La clave es obligatoria"),
        name: yup
            .string()
            .test(
                "no-spaces",
                "No se permiten espacios al inicio o final",
                value => value === undefined || (value === value?.trim())
            )
            .required("El nombre es obligatorio"),
        unit_price: yup
            .number()
            .positive("El precio debe ser mayor a 0")
            .required("El precio es obligatorio"),
        stock: yup
            .number()
            .integer("El stock debe ser un número entero")
            .min(0, "El stock no puede ser negativo")
            .required("El stock es obligatorio"),
        category_id: yup
            .number()
            .required("Selecciona una categoría"),
    });

    const formik = useFormik({
        initialValues: {
            clave: '',
            name: '',
            unit_price: '',
            stock: '',
            category_id: '',
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            const confirmed = await alertaPregunta(
                "¿Deseas crear el producto?",
                "Esta acción creará un nuevo producto."
            );
            if (!confirmed) {
                setSubmitting(false);
                return;
            }
            alertaCargando('Creando producto...', 'Por favor, espere');
            try {
                const body = {
                    clave: values.clave,
                    name: values.name,
                    unit_price: parseFloat(values.unit_price),
                    stock: parseInt(values.stock),
                    category: {
                        id_category: parseInt(values.category_id)
                    }
                };
                console.log('Creating product with body:', body);
                const response = await AxiosClient.post('/productos/create', body);
                if (response?.data) {
                    alertaExito('Éxito', '¡Producto creado correctamente!');
                    resetForm();
                    if (onSuccess) onSuccess(response.data);
                    onClose();
                }
            } catch (error) {
                const mensaje = error.response?.data?.message || 'No se pudo crear el producto';
                alertaError('Error', mensaje);
            } finally {
                setSubmitting(false);
            }
        },
    });

    const fetchCategories = async () => {
        try {
            const response = await AxiosClient.get('/categorias/');
            setCategories(response.data || []);
        } catch (error) {
            console.error('Error al obtener categorías:', error);
            setCategories([]);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-6" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                <div className="absolute top-4 right-4">
                    <button onClick={onClose} className="cursor-pointer">
                        <img src={Close} alt="Cerrar" className="w-6 h-6" />
                    </button>
                </div>
                <h2 className="text-2xl font-bold text-center mb-6 font-poppins">Crear Producto</h2>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <label className={labelStyles}>Clave:</label>
                        <input
                            type="text"
                            name="clave"
                            value={formik.values.clave}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={inputStyles}
                            placeholder="Ej: RI-001"
                            required
                        />
                        {formik.touched.clave && formik.errors.clave && (
                            <div className="text-red-600 text-sm mt-1">{formik.errors.clave}</div>
                        )}
                    </div>
                    <div>
                        <label className={labelStyles}>Nombre:</label>
                        <input
                            type="text"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={inputStyles}
                            placeholder="Nombre del producto"
                            required
                        />
                        {formik.touched.name && formik.errors.name && (
                            <div className="text-red-600 text-sm mt-1">{formik.errors.name}</div>
                        )}
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className={labelStyles}>Stock:</label>
                            <input
                                type="number"
                                name="stock"
                                value={formik.values.stock}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={inputStyles}
                                placeholder="Cantidad en stock"
                                min="0"
                                required
                            />
                            {formik.touched.stock && formik.errors.stock && (
                                <div className="text-red-600 text-sm mt-1">{formik.errors.stock}</div>
                            )}
                        </div>
                        <div className="flex-1">
                            <label className={labelStyles}>Precio por unidad:</label>
                            <input
                                type="number"
                                step="0.01"
                                name="unit_price"
                                value={formik.values.unit_price}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={inputStyles}
                                placeholder="0.00"
                                min="0.01"
                                required
                            />
                            {formik.touched.unit_price && formik.errors.unit_price && (
                                <div className="text-red-600 text-sm mt-1">{formik.errors.unit_price}</div>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className={labelStyles}>Categoría:</label>
                        <select
                            name="category_id"
                            value={formik.values.category_id}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={selectStyles}
                            required
                        >
                            <option value="">Selecciona una categoría</option>
                            {categories.map((category) => (
                                <option key={category.id_category} value={category.id_category}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {formik.touched.category_id && formik.errors.category_id && (
                            <div className="text-red-600 text-sm mt-1">{formik.errors.category_id}</div>
                        )}
                    </div>
                    <div className="flex justify-between mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-100 hover:bg-gray-300 text-gray-700 font-medium rounded-lg px-5 py-2 w-32 cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={formik.isSubmitting || !formik.isValid}
                            className="custom-blue-bottom text-white hover:bg-blue-900 font-medium rounded-lg px-5 py-2 w-32 cursor-pointer disabled:cursor-not-allowed disabled:opacity-80"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewProductModal;