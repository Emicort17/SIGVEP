import React from 'react';
import Close from '../../../assets/closeb.svg';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { alertaCargando, alertaError, alertaExito, alertaPregunta } from '../../../config/context/alerts';
import { AxiosClient } from '../../../config/http-gateway/http-client';

function NewCategoryModal({ isOpen, onClose, onSuccess }) {
    const labelStyles = "block mb-2 text-base custom-blue font-medium text-gray-900";
    const inputStyles = "bg-custom-bluelight border-t-0 border-x-0 text-gray-900 text-sm rounded-lg focus:ring-0 block w-full ps-3 p-2.5 custom-border-bottom";

    const validationSchema = yup.object({
        name: yup
            .string()
            .test(
                "no-spaces",
                "No se permiten espacios al inicio o final",
                value => value === undefined || (value === value?.trim())
            )
            .required("El nombre es obligatorio"),
        description: yup
            .string()
            .test(
                "no-spaces",
                "No se permiten espacios al inicio o final",
                value => value === undefined || (value === value?.trim())
            )
            .required("La descripción es obligatoria"),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            const confirmed = await alertaPregunta(
                "¿Deseas guardar la categoría?",
                "Esta acción creará una nueva categoría."
            );
            if (!confirmed) {
                setSubmitting(false);
                return;
            }
            alertaCargando('Creando categoría...', 'Por favor, espere');
            try {
                const body = {
                    name: values.name,
                    description: values.description,
                };
                const response = await AxiosClient.post('/categorias/', body);
                if (response?.data) {
                    alertaExito('Éxito', '¡Categoría creada correctamente!');
                    resetForm();
                    if (onSuccess) onSuccess(response.data);
                    onClose();
                }
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'No se pudo crear la categoría';
                alertaError('Error', errorMessage);
            } finally {
                setSubmitting(false);
            }
        },
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-6" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                <div className="absolute top-4 right-4">
                    <button onClick={onClose} className="cursor-pointer">
                        <img src={Close} alt="Cerrar" className="w-6 h-6" />
                    </button>
                </div>
                <h2 className="text-2xl font-bold text-center mb-6 font-poppins">Agregar Categoría</h2>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <label className={labelStyles}>Nombre:</label>
                        <input
                            type="text"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={inputStyles}
                            placeholder="Nombre de la categoría"
                            required
                        />
                        {formik.touched.name && formik.errors.name && (
                            <div className="text-red-600 text-sm mt-1">{formik.errors.name}</div>
                        )}
                    </div>
                    <div>
                        <label className={labelStyles}>Descripción:</label>
                        <textarea
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={inputStyles}
                            placeholder="Descripción"
                            rows={3}
                            required
                        />
                        {formik.touched.description && formik.errors.description && (
                            <div className="text-red-600 text-sm mt-1">{formik.errors.description}</div>
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

export default NewCategoryModal;