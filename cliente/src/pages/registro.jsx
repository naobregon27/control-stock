import React, { useEffect, useState, useRef } from 'react';
import { useDownloadExcel } from 'react-export-table-to-excel';

const Registro = () => {
  const [ventas, setVentas] = useState([]);
  const [filteredVentas, setFilteredVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const [paginaActual, setPaginaActual] = useState(0);
  const ventasPorPagina = 15;
  const maxNumerosPorPagina = 5;

  const tableRef = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: 'tabla_RegistroVentas',
    sheet: 'Ventas'
  });

  useEffect(() => {
    fetch("https://control-stock-06su.onrender.com/ventas")
      .then(response => response.json())
      .then(data => {
        setVentas(data);
        setFilteredVentas(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const handleFilter = () => {
    const filtered = ventas.filter(venta => {
      const fechaVenta = new Date(venta.fechaRegistro);
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      return fechaVenta >= inicio && fechaVenta <= fin;
    });
    setFilteredVentas(filtered);
  };

  if (loading) {
    return <div>Cargando datos...</div>;
  }

  const ventasOrdenadas = filteredVentas.sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro));
  const totalPaginas = Math.ceil(ventasOrdenadas.length / ventasPorPagina);

  const handlePaginaAnterior = () => {
    setPaginaActual((prev) => Math.max(prev - 1, 0));
  };

  const handlePaginaSiguiente = () => {
    setPaginaActual((prev) => Math.min(prev + 1, totalPaginas - 1));
  };

  const handlePaginaClick = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  const ventasPaginadas = ventasOrdenadas.slice(
    paginaActual * ventasPorPagina,
    (paginaActual + 1) * ventasPorPagina
  );

  const inicio = Math.floor(paginaActual / maxNumerosPorPagina) * maxNumerosPorPagina;
  const fin = Math.min(inicio + maxNumerosPorPagina, totalPaginas);

  return (
    
    <div className="container mx-auto p-3">
      <br />
      <br />
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
          <br />
          <button
        onClick={onDownload}
        className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded"
      >
        Exportar a Excel
      </button>
          <br />
          <br />
          <div className="bg-green-500 text-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h3 className="text-2xl font-bold my-3">Lista de Ventas</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-400" ref={tableRef}>
                <thead>
                  <tr className="bg-teal-500 text-white">
                    <th className="py-2 px-4 border-b">Fecha de Registro</th>
                    <th className="py-2 px-4 border-b">Nombre del Producto</th>
                    <th className="py-2 px-4 border-b">Precio</th>
                    <th className="py-2 px-4 border-b">Cantidad</th>
                    <th className="py-2 px-4 border-b">Cliente</th>
                    <th className="py-2 px-4 border-b">Documento del Cliente</th>
                    <th className="py-2 px-4 border-b">Medio de Pago</th>
                  </tr>
                </thead>
                <tbody>
                  {ventasPaginadas.length > 0 ? (
                    ventasPaginadas.map((venta, index) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="py-2 px-4 border-b text-black">{new Date(venta.fechaRegistro).toLocaleString()}</td>
                        <td className="py-2 px-4 border-b text-black">{venta.nombreProducto}</td>
                        <td className="py-2 px-4 border-b text-black">${venta.precio}</td>
                        <td className="py-2 px-4 border-b text-black">{venta.cantidad}</td>
                        <td className="py-2 px-4 border-b text-black">{venta.nombreCliente}</td>
                        <td className="py-2 px-4 border-b text-black">{venta.documentoCliente}</td>
                        <td className="py-2 px-4 border-b text-black">{venta.medioPago}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-2 px-4 border-b text-black">No se encontraron ventas en el rango de fechas seleccionado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="flex justify-between mt-4">
              <button
                onClick={handlePaginaAnterior}
                disabled={paginaActual === 0}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Anterior
              </button>
              <div className="flex space-x-2">
                {Array.from({ length: fin - inicio }, (_, i) => inicio + i).map((numeroPagina) => (
                  <button
                    key={numeroPagina}
                    onClick={() => handlePaginaClick(numeroPagina)}
                    className={`${
                      paginaActual === numeroPagina ? 'bg-blue-700' : 'bg-blue-500'
                    } hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                  >
                    {numeroPagina + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={handlePaginaSiguiente}
                disabled={paginaActual === totalPaginas - 1}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Siguiente
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro;





                 