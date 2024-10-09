import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


const Orders = () => {
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nombreProducto, setNombreProducto] = useState('');
  const [nombreMarca, setNombreMarca] = useState('');


  const [paginaActual, setPaginaActual] = useState(0);
  const productosPorPagina = 15;
  const maxNumerosPorPagina = 5;

  const tableRef = useRef(null);
  // const { onDownload } = useDownloadExcel({
  //   currentTableRef: tableRef.current,
  //   filename: 'tabla_Inventario',
  //   sheet: 'Stock'
  // });

  const navigate = useNavigate();
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        //const response = await fetch('http://localhost:4000/task');
        const response = await fetch("https://control-stock-06su.onrender.com/task");
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error('Error fetching productos:', error);
      }
    };

    const fetchVentas = async () => {
      try {
        //const response = await fetch('http://localhost:4000/ventas');
        const response = await fetch("https://control-stock-06su.onrender.com/ventas")
        const data = await response.json();
        setVentas(data);
      } catch (error) {
        console.error('Error fetching ventas:', error);
      }
    };

    Promise.all([fetchProductos(), fetchVentas()]).then(() => setLoading(false));
  }, []);

  useEffect(() => {
    const productosBajoStock = productos.filter(producto => {
      const cantidadSalida = getCantidadSalida(producto.nombreProducto) || 0;
      const existencia = producto.cantidad - cantidadSalida;
      return existencia <= 5;
    });

    if (productosBajoStock.length > 0) {
      const nombresProductos = productosBajoStock.map(producto => `${producto.nombreProducto} (${producto.marca})`).join(', ');
      alert(`Los productos: 
        ${nombresProductos},
        tienen en stock 5 o menos`);

    }
  }, [productos, ventas]);

  const getEstiloExistencia = (existencia) => {
    return existencia <= 5 ? { color: 'red' } : {};
  };

  const handleFilter = () => {
    const filteredProductos = productos.filter(producto =>
      producto.nombreProducto.toLowerCase().includes(nombreProducto.toLowerCase()) &&
      producto.marca.toLowerCase().includes(nombreMarca.toLowerCase())
    );
    setProductos(filteredProductos);
  };

  const getCantidadSalida = (nombreProducto) => {
    const ventasProducto = ventas.filter(venta => venta.nombreProducto === nombreProducto);
    return ventasProducto.reduce((total, venta) => total + venta.cantidad, 0);
  };

  const handleDelete = async (id) => {
    try {
      // await axios.delete(`http://localhost:4000/task/delete/${id}`);
      await axios.delete(`https://control-stock-06su.onrender.com/task/delete/${id}`)
      setProductos(productos.filter(producto => producto.id !== id));
    } catch (error) {
      console.error('Error deleting producto:', error);
    }
  };

  const handleEdit = (id) => {
    if (id) {
      navigate(`/Add/${id}/edit`);
    } else {
      console.error('No se encontró el campo id');
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.table_to_sheet(tableRef.current);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Stock');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'tabla_Inventario.xlsx');
  };

  if (loading) {
    return <div>Cargando datos...</div>;
  }

  const productosOrdenados = productos.sort((a, b) => new Date(b.fechaIngreso) - new Date(a.fechaIngreso));
  const totalPaginas = Math.ceil(productosOrdenados.length / productosPorPagina);

  const handlePaginaAnterior = () => {
    setPaginaActual((prev) => Math.max(prev - 1, 0));
  };

  const handlePaginaSiguiente = () => {
    setPaginaActual((prev) => Math.min(prev + 1, totalPaginas - 1));
  };

  const handlePaginaClick = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };
  const productosPaginados = productosOrdenados.slice(
    paginaActual * productosPorPagina,
    (paginaActual + 1) * productosPorPagina
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
            <h3 className="text-2xl font-bold my-3">Bucador del producto</h3>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">
                Nombre del Producto:
                <input
                  type="text"
                  className="border border-gray-400 p-2 rounded w-full text-black"
                  value={nombreProducto}
                  onChange={e => setNombreProducto(e.target.value)}
                />
              </label>
              <label className="block text-sm font-bold mb-2">
                Marca del Producto:
                <input
                  type="text"
                  className="border border-gray-400 p-2 rounded w-full text-black"
                  value={nombreMarca}
                  onChange={e => setNombreMarca(e.target.value)}
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
            onClick={exportToExcel}
            className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded"
          >
            Exportar a Excel
          </button>
          <br />
          <br />
          <div className="bg-green-500 text-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h3 className="text-2xl font-bold my-3">Lista de Productos</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-400" ref={tableRef} >
                <thead>
                  <tr className="bg-teal-500 text-white">
                    <th className="py-2 px-4 border-b">Nombre del Producto</th>
                    <th className="py-2 px-4 border-b">Marca</th>
                    <th className="py-2 px-4 border-b">Precio</th>
                    <th className="py-2 px-4 border-b">Fecha de Ingreso</th>
                    <th className="py-2 px-4 border-b">Cantidad</th>
                    <th className="py-2 px-4 border-b">Categoría</th>
                    <th className="py-2 px-4 border-b">Cantidad Salida</th>
                    <th className="py-2 px-4 border-b">Existencia</th>
                    <th className="py-2 px-4 border-b">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosPaginados.map((producto, index) => {
                    const cantidadSalida = getCantidadSalida(producto.nombreProducto) || 0;
                    const existencia = producto.cantidad - cantidadSalida;
                    return (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="py-2 px-4 border-b text-black">{producto.nombreProducto}</td>
                        <td className="py-2 px-4 border-b text-black">{producto.marca}</td>
                        <td className="py-2 px-4 border-b text-black">${producto.precio}</td>
                        <td className="py-2 px-4 border-b text-black">{new Date(producto.fechaIngreso).toLocaleString()}</td>
                        <td className="py-2 px-4 border-b text-black">{producto.cantidad}</td>
                        <td className="py-2 px-4 border-b text-black">{producto.categoria}</td>
                        <td className="py-2 px-4 border-b text-black">{cantidadSalida}</td>
                        <td className="py-2 px-4 border-b text-black" style={getEstiloExistencia(existencia)}>{existencia}</td>
                        <td className="py-2 px-4 border-b">
                          <button
                            onClick={() => handleEdit(producto.id)}
                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                          >
                            Modificar
                          </button>
                          <button
                            onClick={() => handleDelete(producto.id)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
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
                      className={`${paginaActual === numeroPagina ? 'bg-blue-700' : 'bg-blue-500'
                        } hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                    >
                      {numeroPagina + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handlePaginaSiguiente}
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

export default Orders;


