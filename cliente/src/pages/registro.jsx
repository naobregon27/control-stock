import React, { useEffect, useState } from 'react';

const Registro = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  useEffect(() => {
    //fetch('http://localhost:4000/ventas')
    fetch("https://control-stock-06su.onrender.com/ventas")
      .then(response => response.json())
      .then(data => {
        setVentas(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const handleFilter = () => {
    const filteredVentas = ventas.filter(venta => {
      const fechaVenta = new Date(venta.fechaRegistro);
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      return fechaVenta >= inicio && fechaVenta <= fin;
    });
    setVentas(filteredVentas);
  };

  if (loading) {
    return <div>Cargando datos...</div>;
  }

  return (
    <div className="container mx-auto p-3">
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <div className="bg-green-500 text-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h3 className="text-2xl font-bold my-3">Filtrar por Fecha</h3>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">
                Fecha Inicio:
                <input
                  type="date"
                  className="border border-gray-400 p-2 rounded w-full text-black"
                  value={fechaInicio}
                  onChange={e => setFechaInicio(e.target.value)}
                />
              </label>
              <label className="block text-sm font-bold mb-2">
                Fecha Fin:
                <input
                  type="date"
                  className="border border-gray-400 p-2 rounded w-full text-black"
                  value={fechaFin}
                  onChange={e => setFechaFin(e.target.value)}
                />
              </label>
              <button
                onClick={handleFilter}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Filtrar
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          <div className="bg-green-500 text-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h3 className="text-2xl font-bold my-3">Lista de Ventas</h3>
            <table className="min-w-full bg-white border border-gray-400">
              <thead>
                <tr className="bg-teal-500 text-white">
                  <th className="py-2 px-4 border-b">Fecha de Registro</th>
                  <th className="py-2 px-4 border-b">Nombre del Producto</th>
                  <th className="py-2 px-4 border-b">Precio</th>
                  <th className="py-2 px-4 border-b">Cantidad</th>
                  <th className="py-2 px-4 border-b">Cliente</th>
                  <th className="py-2 px-4 border-b">Documento del Cliente</th>
                </tr>
              </thead>
              <tbody>
                {ventas.map((venta, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b text-black">{venta.fechaRegistro}</td>
                    <td className="py-2 px-4 border-b text-black">{venta.nombreProducto}</td>
                    <td className="py-2 px-4 border-b text-black">${venta.precio}</td>
                    <td className="py-2 px-4 border-b text-black">{venta.cantidad}</td>
                    <td className="py-2 px-4 border-b text-black">{venta.nombreCliente}</td>
                    <td className="py-2 px-4 border-b text-black">{venta.documentoCliente}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4">
              <label className="block text-sm font-bold mb-2">
                Total de Ventas del Día:
                <input
                  type="text"
                  className="border border-gray-400 p-2 rounded w-full text-black"
                  value={`$${ventas.reduce((total, venta) => total + venta.precio, 0).toFixed(2)}`}
                  readOnly
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro;