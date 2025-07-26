import React from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Tooltip, Legend);

function Main() {
  // Datos de ejemplo (dummy)
  const ventasDia = [500, 1200, 1800, 2200, 2500, 3000, 3252.52];
  const ventasMensuales = [4000, 3500, 5000, 6000, 7000, 8000, 9000];
  const ventasAnuales = [12000, 15000, 18000, 20000, 17000, 21000, 23000, 22000, 25000, 24000, 26000, 27000];

  // Configuración Line Chart (Ventas del Día)
  const lineData = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
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

  // Configuración Pie Chart (Ventas Mensuales)
  const pieData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Ventas Mensuales',
        data: ventasMensuales,
        backgroundColor: [
          '#4BC0C0', '#36A2EB', '#FFCE56', '#FF6384', '#9966FF', '#FF9F40', '#8DD1E1'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Configuración Bar Chart (Ventas Anuales)
  const barData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [
      {
        label: 'Ventas Anuales',
        data: ventasAnuales,
        backgroundColor: [
          '#FFD600', '#FFB300', '#FF6D00', '#00B8D4', '#00C853', '#AEEA00',
          '#D500F9', '#C51162', '#FF1744', '#6D4C41', '#8D6E63', '#BDBDBD'
        ],
      },
    ],
  };

  // Aquí después puedes traer tus datos filtrados y reemplazar ventasDia, ventasMensuales, ventasAnuales

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-xl font-bold mb-4">Inicio</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-gray-500 text-sm">Ventas del Día</div>
          <div className="text-2xl font-bold custom-blue">$3,252.52</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-gray-500 text-sm">Ventas Mensuales</div>
          <div className="text-2xl font-bold custom-blue">$25,252.52</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-gray-500 text-sm">Ventas Anuales</div>
          <div className="text-2xl font-bold custom-blue">$3,251,252.52</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <div className="font-bold mb-2">Ventas del Día</div>
          <Line data={lineData} options={{ responsive: true, plugins: { legend: { display: false } } }} height={180} />
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <div className="font-bold mb-2">Ventas Mensuales</div>
          <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} height={180} />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
        <div className="font-bold mb-2">Ventas Anuales</div>
        <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} height={220} />
      </div>
    </div>
  );
}

export default Main;