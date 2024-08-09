import React, { useEffect, useState } from 'react';

const Registro = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/ventas')
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
   <div>
    <div className="mb-4">
    <label className="block text-sm font-bold mb-2">
      Fecha Inicio:
      <input
        type="date"
        className="border border-gray-400 p-2 rounded w-full"
        value={fechaInicio}
        onChange={e => setFechaInicio(e.target.value)}
      />
    </label>
    <label className="block text-sm font-bold mb-2">
      Fecha Fin:
      <input
        type="date"
        className="border border-gray-400 p-2 rounded w-full"
        value={fechaFin}
        onChange={e => setFechaFin(e.target.value)}
      />
    </label>
    <button onClick={handleFilter} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Filtrar</button>
  </div>

  <table className="min-w-full bg-white border border-gray-400">
    <thead>
      <tr>
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
          <td className="py-2 px-4 border-b">{venta.fechaRegistro}</td>
          <td className="py-2 px-4 border-b">{venta.nombreProducto}</td>
          <td className="py-2 px-4 border-b">${venta.precio}</td>
          <td className="py-2 px-4 border-b">{venta.cantidad}</td>
          <td className="py-2 px-4 border-b">{venta.nombreCliente}</td>
          <td className="py-2 px-4 border-b">{venta.documentoCliente}</td>
        </tr>
      ))}
    </tbody>
  </table>
   </div>
  );
};

export default Registro;