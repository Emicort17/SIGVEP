import React from "react";
import Close from "../../../assets/closeb.svg";
import { AxiosClient } from "../../../config/http-gateway/http-client";
import { alertaCargando, alertaError, alertaExito, alertaPregunta } from "../../../config/context/alerts";
import { useFormik } from "formik";
import * as yup from "yup";

function EditUserInformationModal({ isOpen, onClose, userData, onSuccess }) {
  const labelStyles = "block mb-2 text-base custom-blue font-medium text-gray-900";
  const inputStyles = "bg-custom-bluelight border-t-0 border-x-0 text-gray-900 text-sm rounded-lg focus:ring-0 block w-full ps-3 p-2.5 custom-border-bottom";

  if (!isOpen) return null;

  const [apellidoPaterno = "", apellidoMaterno = ""] = (userData?.apellido || "").split(" ");

  const validationSchema = yup.object({
    nombre: yup
      .string()
      .test(
        "no-spaces",
        "No se permiten espacios al inicio o final",
        value => value === undefined || (value === value?.trim())
      )
      .required("El nombre es obligatorio"),
    apellidoPaterno: yup
      .string()
      .test(
        "no-spaces",
        "No se permiten espacios al inicio o final",
        value => value === undefined || (value === value?.trim())
      )
      .required("El apellido paterno es obligatorio"),
    apellidoMaterno: yup
      .string()
      .test(
        "no-spaces",
        "No se permiten espacios al inicio o final",
        value => value === undefined || (value === value?.trim())
      )
      .required("El apellido materno es obligatorio"),
    email: yup
      .string()
      .test(
        "no-spaces",
        "No se permiten espacios al inicio o final",
        value => value === undefined || (value === value?.trim())
      )
      .email("Correo electrónico inválido")
      .required("El correo electrónico es obligatorio"),
    telefono: yup
      .string()
      .matches(/^\d{10}$/, "El teléfono debe tener 10 dígitos")
      .required("El teléfono es obligatorio"),
  });

  const formik = useFormik({
    initialValues: {
      nombre: userData?.nombre || "",
      apellidoPaterno,
      apellidoMaterno,
      email: userData?.email || "",
      telefono: userData?.telefono || "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const confirmed = await alertaPregunta(
        "¿Deseas guardar los cambios?",
        "Esta acción actualizará la información del usuario."
      );
      if (!confirmed) {
        setSubmitting(false);
        return;
      }
      alertaCargando("Guardando información...", "Por favor, espere");
      try {
        const response = await AxiosClient.put(`/usuarios/${userData.id_usuario}`, {
          nombre: values.nombre,
          apellido: `${values.apellidoPaterno} ${values.apellidoMaterno}`,
          telefono: values.telefono,
          email: values.email,
        });
        if (response?.data) {
          alertaExito("Éxito", "¡Datos guardados correctamente!");
          if (onSuccess) onSuccess(response.data);
          onClose();
        }
      } catch (error) {
        alertaError("Error", "Error al guardar los datos");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-6" style={{ maxHeight: "80vh", overflowY: "auto" }}>
        <div className="absolute top-4 right-4">
          <button onClick={onClose} className="cursor-pointer">
            <img src={Close} alt="Cerrar" className="w-6 h-6" />
          </button>
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 font-poppins">
          Editar Usuario
        </h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className={labelStyles}>Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={formik.values.nombre}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={inputStyles}
              placeholder="Nombre"
              required
            />
            {formik.touched.nombre && formik.errors.nombre && (
              <div className="text-red-600 text-sm mt-1">{formik.errors.nombre}</div>
            )}
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className={labelStyles}>Apellido Paterno:</label>
              <input
                type="text"
                name="apellidoPaterno"
                value={formik.values.apellidoPaterno}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputStyles}
                placeholder="Apellido Paterno"
                required
              />
              {formik.touched.apellidoPaterno && formik.errors.apellidoPaterno && (
                <div className="text-red-600 text-sm mt-1">{formik.errors.apellidoPaterno}</div>
              )}
            </div>
            <div className="flex-1">
              <label className={labelStyles}>Apellido Materno:</label>
              <input
                type="text"
                name="apellidoMaterno"
                value={formik.values.apellidoMaterno}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputStyles}
                placeholder="Apellido Materno"
                required
              />
              {formik.touched.apellidoMaterno && formik.errors.apellidoMaterno && (
                <div className="text-red-600 text-sm mt-1">{formik.errors.apellidoMaterno}</div>
              )}
            </div>
          </div>
          <div>
            <label className={labelStyles}>Correo Electrónico:</label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={inputStyles}
              placeholder="Correo Electrónico"
              required
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-600 text-sm mt-1">{formik.errors.email}</div>
            )}
          </div>
          <div>
            <label className={labelStyles}>Teléfono:</label>
            <input
              type="text"
              name="telefono"
              value={formik.values.telefono}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={inputStyles}
              placeholder="Teléfono"
              required
            />
            {formik.touched.telefono && formik.errors.telefono && (
              <div className="text-red-600 text-sm mt-1">{formik.errors.telefono}</div>
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

export default EditUserInformationModal;