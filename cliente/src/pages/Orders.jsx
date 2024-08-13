import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';


const Orders = () => {
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nombreProducto, setNombreProducto] = useState('');

  const navigate = useNavigate();




  useEffect(() => {
    const fetchProductos = async () => {
      try {
        // const response = await fetch('http://localhost:4000/task');
        const response = await fetch("https://control-stock-06su.onrender.com/task");
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error('Error fetching productos:', error);
      }
    };

    const fetchVentas = async () => {
      try {
        // const response = await fetch('http://localhost:4000/ventas');
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
      const existencia = producto.cantidad - cantidadSalida ;
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
      producto.nombreProducto.toLowerCase().includes(nombreProducto.toLowerCase())
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

  if (loading) {
    return <div>Cargando datos...</div>;
  }

  return (
    <div className="container mx-auto p-3">
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <div className="bg-green-500 text-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h3 className="text-2xl font-bold my-3">Filtrar por Nombre del Producto</h3>
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
            <h3 className="text-2xl font-bold my-3">Lista de Productos</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-400">
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
                  {productos.map((producto, index) => {
                    const cantidadSalida = getCantidadSalida(producto.nombreProducto)|| 0;
                    const existencia = producto.cantidad - cantidadSalida;
                    return (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="py-2 px-4 border-b text-black">{producto.nombreProducto}</td>
                        <td className="py-2 px-4 border-b text-black">{producto.marca}</td>
                        <td className="py-2 px-4 border-b text-black">{producto.precio}</td>
                        <td className="py-2 px-4 border-b text-black">{producto.fechaIngreso}</td>
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
                            Borrar
                          </button>
                        </td>
                      </tr>

                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;


