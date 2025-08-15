import React, { useState, useEffect } from 'react';
import { AxiosClient } from '../../config/http-gateway/http-client';
import { Paginator } from 'primereact/paginator';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { alertaExito, alertaError, alertaCargando } from '../../config/context/alerts';
import search_white from '../../assets/search1.svg';
import Category from '../../assets/categoryw.svg';
import shopping_cart from '../../assets/shopping_cart.svg';
import Carrito from '../../assets/carrito.svg';
import Basura from '../../assets/basura.svg';
import Close from '../../assets/closeb.svg';

function CategorySelectModal({ isOpen, onClose, categorias, categoriaSeleccionada, setCategoriaSeleccionada }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-xl mx-auto p-6" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
        <div className="absolute top-4 right-4">
          <button onClick={onClose} className="cursor-pointer">
            <img src={Close} alt="Cerrar" className="w-6 h-6" />
          </button>
        </div>
        <h2 className="text-xl font-bold text-center mb-6 font-poppins">Seleccionar Categoría</h2>
        <div className="space-y-2">
          <button
            className={`w-full px-4 py-2 rounded-lg text-left font-medium cursor-pointer ${!categoriaSeleccionada ? 'bg-[#1E3A8A] text-white' : 'hover:bg-gray-100'}`}
            onClick={() => {
              setCategoriaSeleccionada(null);
              onClose();
            }}
          >
            Todas las categorías
          </button>
          {categorias.map(cat => (
            <button
              key={cat.id_category}
              className={`w-full px-4 py-2 rounded-lg text-left font-medium cursor-pointer ${categoriaSeleccionada === cat.id_category ? 'bg-[#1E3A8A] text-white' : 'hover:bg-gray-100'}`}
              onClick={() => {
                setCategoriaSeleccionada(cat.id_category);
                onClose();
              }}
            >
              <span className="truncate overflow-hidden whitespace-nowrap w-full block">{cat.name}</span>
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-6 bg-gray-100 hover:bg-gray-300 text-gray-700 font-medium rounded-lg px-5 py-2 w-full cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

const getFormattedLocalDateTime = () => {
  const d = new Date();
  const YYYY = d.getFullYear();
  const MM = String(d.getMonth() + 1).padStart(2, '0');
  const DD = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`;
};

function NewSalesU() {
  const [modalCategorias, setModalCategorias] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [products, setProducts] = useState([]);
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [valorRecibido, setValorRecibido] = useState('');
  const [pagina, setPagina] = useState(1);
  const [Buscar, setBusqueda] = useState('');
  const token = localStorage.getItem('token');
  const productos = 8;
  const stripe = useStripe();
  const elements = useElements();
  const [carrito, setCarrito] = useState(() => {
    try {
      const saved = localStorage.getItem('carrito');
      const parsed = saved ? JSON.parse(saved) : [];
      return parsed.filter(item => item.id_product && item.unit_price && item.name && item.cantidad);
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  const fetchProducts = async () => {
    try {
      const response = await AxiosClient.get('/productos/');
      setProducts((response.data || []).filter(p => p.status));
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await AxiosClient.get('/categorias/');
      if (response.data) {
        setCategorias((response.data || []).filter(cat => cat.status));
      }
    } catch (error) {
      setCategorias([]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategorias();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('carrito', JSON.stringify(carrito));
      console.log('Carrito guardado en localStorage:', carrito);
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [carrito]);

  const filtroProductos = products
    .filter(p => p.name.toLowerCase().includes(Buscar.toLowerCase()))
    .filter(p => categoriaSeleccionada ? p.category?.id_category === categoriaSeleccionada : true);

  const paginasTotales = Math.ceil(filtroProductos.length / productos);
  const inicio = (pagina - 1) * productos;
  const lista_productos = filtroProductos.slice(inicio, inicio + productos);

  const añadircarrito = (product) => {
    if (!product || !product.id_product || !product.unit_price || !product.name) {
      console.error('Producto inválido:', product);
      alertaError('Error', 'No se puede añadir un producto inválido al carrito.');
      return;
    }
    const existingItem = carrito.find((item) => item.id_product === product.id_product);
    if (existingItem) {
      setCarrito(carrito.map((item) =>
        item.id_product === product.id_product
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setCarrito([...carrito, { ...product, cantidad: 1 }]);
    }
  };

  const eliminarcarrito = (productId) => {
    setCarrito(carrito.filter((item) => item.id_product !== productId));
  };

  const preciototal = () => {
    return carrito.reduce((total, item) => total + item.unit_price * item.cantidad, 0);
  };

  const totaldeproductos = () => {
    return carrito.reduce((total, item) => total + item.cantidad, 0);
  };

  const getStock = (stock) => {
    if (stock < 30) return 'text-red-500';
    return 'text-green-500';
  };

  const calcularCambio = () => {
    const recibido = Number.parseFloat(valorRecibido) || 0;
    const total = preciototal();
    return recibido >= total ? recibido - total : 0;
  };

  const registrarEfectivo = async () => {
    if (metodoPago === 'Efectivo') {
      const recibido = Number.parseFloat(valorRecibido) || 0;
      const total = preciototal();
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      const Data = {
        date: getFormattedLocalDateTime(),
        userId: user.user?.idUsuario,
        payment_type: 'Efectivo',
        products: carrito.map(item => ({
          productId: item.id_product,
          quantity: item.cantidad,
        })),
      };

      if (recibido < total) {
        alertaError('Error', 'No tienes la cantidad necesaria para procesar el pago.');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        alertaCargando('Procesando', 'Registrando venta en efectivo...');
        const response = await AxiosClient.post('http://localhost:8000/api/ventas/create', Data, config);
        console.log('Respuesta de venta en efectivo:', response.data);
        alertaExito('Éxito', 'Venta registrada correctamente.');
        setCarrito([]);
        setValorRecibido('');
      } catch (error) {
        console.error('Error registrando la venta en efectivo:', error.response?.data || error.message);
        alertaError('Error', 'Hubo un problema registrando la venta. Inténtelo de nuevo.');
      }
    }
  };

  const registroPago = async () => {
    if (metodoPago === 'Efectivo') {
      registrarEfectivo();
    } else {
      if (!stripe || !elements) {
        alertaError('Error', 'Stripe aún no está listo.');
        return;
      }
      const cardElement = elements.getElement(CardElement);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: 'Cliente Distinguido',
        },
      });
      if (error) {
        alertaError('Error', error.message);
        return;
      }
      const Data = {
        date: getFormattedLocalDateTime(),
        userId: user.user?.idUsuario,
        payment_type: metodoPago === 'credito' ? 'Crédito' : 'Débito',
        products: carrito.map(item => ({
          productId: item.id_product,
          quantity: item.cantidad,
        })),
        paymentMethodId: paymentMethod.id,
      };
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        alertaCargando('Procesando', 'Registrando venta con tarjeta...');
        const response = await AxiosClient.post('http://localhost:8000/api/ventas/create', Data, config);
        console.log('Respuesta de venta con tarjeta:', response.data);
        if (response.data.clientSecret) {
          const { clientSecret, paymentIntentId } = response.data;
          const confirmResult = await stripe.confirmCardPayment(clientSecret, {
            payment_method: paymentMethod.id,
          });
          if (confirmResult.paymentIntent?.status === 'succeeded') {
            const finalData = {
              ...Data,
              paymentIntentId,
            };
            await AxiosClient.post('http://localhost:8000/api/ventas/create', finalData, config);
            alertaExito('Pago exitoso', 'La venta fue registrada exitosamente.');
            setCarrito([]);
            setValorRecibido('');
          } else {
            alertaError('Error', 'El pago no se completó correctamente.');
          }
        } else {
          alertaError('Error', 'No se recibió clientSecret de Stripe.');
        }
      } catch (error) {
        console.error('Error registrando la venta con tarjeta:', error.response?.data || error.message);
        alertaError('Error', 'Algo salió mal, por favor intenta otra vez.');
      }
    }
  };

  return (
    <div className="flex gap-5 bg-gray-100 min-h-screen items-start">
      <div className="flex-1 w-2/3 rounded-lg flex flex-col">
        <h2 className="text-2xl font-bold mb-5 text-gray-800">Productos</h2>

        <div className="flex gap-4 mb-5 items-center">
          <div className="relative flex-1 w-full">
            <img
              src={search_white}
              alt="Buscar"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60"
            />
            <input
              type="text"
              placeholder="Buscar..."
              value={Buscar}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10 w-full border border-gray-300 rounded-lg py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setModalCategorias(true)}
            className="bg-[#1E3A8A] text-white font-medium rounded-lg px-5 py-2 w-40 flex items-center gap-2 justify-center hover:bg-blue-900 transition-colors duration-150 cursor-pointer"
          >
            <img src={Category} alt="Categoria" className='w-4 h-4' />
            {categoriaSeleccionada ? categorias.find(cat => cat.id_category === categoriaSeleccionada)?.name : 'Categorías'}
          </button>
        </div>

        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#1E3A8A] text-white">
                <th className="p-3 text-left text-sm font-semibold">#</th>
                <th className="p-3 text-left text-sm font-semibold">Clave</th>
                <th className="p-3 text-left text-sm font-semibold">Nombre</th>
                <th className="p-3 text-left text-sm font-semibold">Precio</th>
                <th className="p-3 text-left text-sm font-semibold">Stock</th>
                <th className="p-3 text-left text-sm font-semibold">Añadir</th>
              </tr>
            </thead>
            <tbody>
              {lista_productos.map((producto, index) => (
                <tr
                  key={producto.id_product}
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-200`}
                >
                  <td className="p-3 text-sm">{inicio + index + 1}</td>
                  <td className="p-3 text-sm">{producto.clave}</td>
                  <td className="p-3 text-sm truncate">{producto.name}</td>
                  <td className="p-3 text-sm font-medium">${producto.unit_price}</td>
                  <td className="p-3 text-sm">
                    <span className={`font-medium ${getStock(producto.stock)}`}>● {producto.stock}</span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => añadircarrito(producto)}
                      className="bg-[#1E3A8A] text-white border-none rounded-full w-8 h-8 cursor-pointer flex items-center justify-center hover:bg-blue-700"
                    >
                      <img src={shopping_cart} alt="Agregar a carrito" className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center custom-datatable">
          <Paginator
            first={(pagina - 1) * productos}
            rows={productos}
            totalRecords={filtroProductos.length}
            onPageChange={e => setPagina(Math.floor(e.first / productos) + 1)}
            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
          />
        </div>
      </div>

      <div className="w-1/3 bg-white rounded-lg p-5 h-full flex flex-col">
        <h2 className="text-2xl font-bold mb-5 text-gray-800">Carrito</h2>
        {carrito.length === 0 ? (
          <div className="flex flex-1 flex-col justify-center items-center min-h-[350px]">
            <img src={Carrito} alt="Carrito vacío" className="mb-4 h-16 w-16" />
            <p className="text-base leading-6 text-center text-gray-600">
              ¡Oh no parece que tu carrito está vacío, por qué no intentas llenarlo!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-[60px_1fr_80px_40px] gap-2.5 bg-[#1E3A8A] text-white p-3 rounded-md mb-2.5 text-sm font-medium">
              <div className='font-semibold'>Cant.</div>
              <div className='font-semibold'>Nombre</div>
              <div className='font-semibold'>Precio</div>
              <div></div>
            </div>
            <div
              className="mb-5"
              style={
                carrito.length > 5
                  ? { maxHeight: '340px', overflowY: 'auto' }
                  : undefined
              }
            >
              {carrito.map((producto) => (
                <div
                  key={producto.id_product}
                  className="grid grid-cols-[60px_1fr_80px_40px] gap-2.5 p-3 border-b border-gray-200 items-center text-sm"
                >
                  <div className="text-center font-medium">{producto.cantidad}</div>
                  <div className="font-medium">{producto.name}</div>
                  <div className="font-medium">${(producto.unit_price * producto.cantidad).toFixed(2)}</div>
                  <button
                    onClick={() => eliminarcarrito(producto.id_product)}
                    className="bg-red-500 text-white border-none rounded-full w-8 h-8 cursor-pointer flex items-center justify-center hover:bg-red-600"
                  >
                    <img src={Basura} alt="Eliminar" className='h-4 w-4' />
                  </button>
                </div>
              ))}
            </div>
            <div className="mb-6">
              <h3 className="text-base font-medium mb-4 text-gray-800">Seleccione el método de Pago</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-md">
                  <input
                    type="radio"
                    value="Efectivo"
                    checked={metodoPago === 'Efectivo'}
                    className="w-4 h-4 text-blue-600"
                    onChange={(e) => setMetodoPago(e.target.value)}
                  />
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <span className="text-lg">💵</span>
                    Efectivo
                  </label>
                </div>
                <div className="ml-7">
                  <label className="block text-sm text-gray-600 mb-1">Valor recibido:</label>
                  <input
                    type="number"
                    value={valorRecibido}
                    onChange={(e) => setValorRecibido(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
                <div className="ml-7">
                  <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-md text-sm font-medium">
                    Cambio: ${calcularCambio().toFixed(2)}
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-md">
                  <input
                    type="radio"
                    value="debito"
                    name="metodoPago"
                    checked={metodoPago === 'debito'}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <span className="text-lg">💳</span>
                    Débito
                  </label>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-md">
                  <input
                    type="radio"
                    className="w-4 h-4 text-blue-600"
                    name="metodoPago"
                    value="credito"
                    checked={metodoPago === 'credito'}
                    onChange={(e) => setMetodoPago(e.target.value)}
                  />
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <span className="text-lg">💳</span>
                    Crédito
                  </label>
                </div>
              </div>
            </div>
            <div className="border-t-2 border-gray-200 pt-4 mb-5">
              <div className="flex justify-between items-center text-base font-bold">
                <span>{totaldeproductos()} Artículos</span>
                <span>Total: ${preciototal().toFixed(2)}</span>
              </div>
            </div>
            {(metodoPago === 'credito' || metodoPago === 'debito') && (
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tarjeta:</label>
                <div className="border border-gray-300 rounded-md p-3">
                  <CardElement />
                </div>
              </div>
            )}
            <div className="flex gap-2.5 mt-4">
              <button
                onClick={() => setCarrito([])}
                className="bg-gray-100 hover:bg-gray-300 text-gray-700 font-medium rounded-lg px-5 py-2 w-32 cursor-pointer transition-colors duration-150"
              >
                Cancelar
              </button>
              <button
                onClick={() => registroPago()}
                className="flex-[2] p-3 bg-[#1E3A8A] text-white hover:bg-blue-900 font-medium rounded-lg px-5 py-2 w-32 cursor-pointer flex items-center justify-center gap-2 transition-colors duration-150"
              >
                Ir al Pago <span>›</span>
              </button>
            </div>
          </>
        )}
      </div>
      <CategorySelectModal
        isOpen={modalCategorias}
        onClose={() => setModalCategorias(false)}
        categorias={categorias}
        categoriaSeleccionada={categoriaSeleccionada}
        setCategoriaSeleccionada={setCategoriaSeleccionada}
      />
    </div>
  );
}

export default NewSalesU;