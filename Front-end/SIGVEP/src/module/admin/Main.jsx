import React, { useEffect, useState } from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Tooltip, Legend } from 'chart.js';
import { AxiosClient } from '../../config/http-gateway/http-client';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Tooltip, Legend);

const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

function Main() {
  const [ventasDia, setVentasDia] = useState([]);
  const [ventasMes, setVentasMes] = useState([]);
  const [ventasAnio, setVentasAnio] = useState([]);
  const [totalDia, setTotalDia] = useState(0);
  const [totalMes, setTotalMes] = useState(0);
  const [totalAnio, setTotalAnio] = useState(0);

  // Utilidad para obtener día de la semana (0=Domingo, 1=Lunes,...)
  const getDayIndex = (dateStr) => {
    const date = new Date(dateStr.replace(' ', 'T'));
    // Ajusta para que 0=Lun, ..., 6=Dom
    let day = date.getDay();
    return day === 0 ? 6 : day - 1;
  };

  // Utilidad para obtener mes (0=Ene, ..., 11=Dic)
  const getMonthIndex = (dateStr) => {
    const date = new Date(dateStr.replace(' ', 'T'));
    return date.getMonth();
  };

  // Utilidad para obtener año
  const getYear = (dateStr) => {
    const date = new Date(dateStr.replace(' ', 'T'));
    return date.getFullYear();
  };

  useEffect(() => {
    // Ventas del día
    AxiosClient.get('/ventas/dia').then(res => {
      const ventas = res.data || [];
      console.log('Ventas del día: ', ventas);
      // Suma total del día
      setTotalDia(ventas.reduce((sum, v) => sum + (v.total_sale || 0), 0));
      // Agrupa por día de la semana
      const ventasPorDia = [0, 0, 0, 0, 0, 0, 0];
      ventas.forEach(v => {
        const idx = getDayIndex(v.date);
        ventasPorDia[idx] += v.total_sale || 0;
      });
      setVentasDia(ventasPorDia);
    });

    // Ventas del mes
    AxiosClient.get('/ventas/mes').then(res => {
      const ventas = res.data || [];
      setTotalMes(ventas.reduce((sum, v) => sum + (v.total_sale || 0), 0));
      // Agrupa por mes
      const ventasPorMes = Array(12).fill(0);
      ventas.forEach(v => {
        const idx = getMonthIndex(v.date);
        ventasPorMes[idx] += v.total_sale || 0;
      });
      setVentasMes(ventasPorMes);
    });

    // Ventas del año
    AxiosClient.get('/ventas/anio').then(res => {
      const ventas = res.data || [];
      setTotalAnio(ventas.reduce((sum, v) => sum + (v.total_sale || 0), 0));
      // Agrupa por año (últimos 5 años)
      const years = {};
      ventas.forEach(v => {
        const year = getYear(v.date);
        years[year] = (years[year] || 0) + (v.total_sale || 0);
      });
      // Ordena por año ascendente y toma los últimos 5
      const yearsSorted = Object.keys(years).sort().slice(-5);
      setVentasAnio(yearsSorted.map(y => ({ year: y, total: years[y] })));
    });
  }, []);

  // Datos para gráficas
  const lineData = {
    labels: diasSemana,
    datasets: [
      {
        label: 'Ventas del Día',
        data: ventasDia,
        borderColor: '#3B5BDB',
        backgroundColor: 'rgba(59,91,219,0.1)',
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const pieData = {
    labels: meses,
    datasets: [
      {
        label: 'Ventas Mensuales',
        data: ventasMes,
        backgroundColor: [
          '#4BC0C0', '#36A2EB', '#FFCE56', '#FF6384', '#9966FF', '#FF9F40',
          '#8DD1E1', '#FFD600', '#FFB300', '#FF6D00', '#00B8D4', '#00C853'
        ],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ventasAnio.map(v => v.year),
    datasets: [
      {
        label: 'Ventas Anuales',
        data: ventasAnio.map(v => v.total),
        backgroundColor: [
          '#FFD600', '#FFB300', '#FF6D00', '#00B8D4', '#00C853'
        ],
      },
    ],
  };

  // Formato de moneda
  const formatCurrency = (num) =>
    num.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 });

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Inicio</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-gray-700 font-poppins font-bold text-xl">Ventas del Día</div>
          <div className="text-2xl font-bold custom-blue">{formatCurrency(totalDia)}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-gray-700 font-poppins font-bold text-xl">Ventas Mensuales</div>
          <div className="text-2xl font-bold custom-blue">{formatCurrency(totalMes)}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-gray-700 font-poppins font-bold text-xl">Ventas Anuales</div>
          <div className="text-2xl font-bold custom-blue">{formatCurrency(totalAnio)}</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <div className="font-semibold mb-2 text-2xl">Ventas del Día</div>
          <Line data={lineData} options={{ responsive: true, plugins: { legend: { display: false } } }} height={180} />
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <div className="font-semibold mb-2 text-2xl">Ventas Mensuales</div>
          <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} height={180} />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
        <div className="font-semibold mb-2 text-2xl">Ventas Anuales</div>
        <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: true } } }} height={220} />
      </div>
    </div>
  );
}

export default Main;