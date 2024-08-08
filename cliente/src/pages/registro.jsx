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
      <div>
        <label>
          Fecha Inicio:
          <input
            type="date"
            value={fechaInicio}
            onChange={e => setFechaInicio(e.target.value)}
          />
        </label>
        <label>
          Fecha Fin:
          <input
            type="date"
            value={fechaFin}
            onChange={e => setFechaFin(e.target.value)}
          />
        </label>
        <button onClick={handleFilter}>Filtrar</button>
      </div>
      <table border="1">
        <thead>
          <tr>
            <th>Fecha de Registro</th>
            <th>Nombre del Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Cliente</th>
            <th>Documento del Cliente</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta, index) => (
            <tr key={index}>
              <td>{venta.fechaRegistro}</td>
              <td>{venta.nombreProducto}</td>
              <td>${venta.precio}</td>
              <td>{venta.cantidad}</td>
              <td>{venta.nombreCliente}</td>
              <td>{venta.documentoCliente}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Registro;