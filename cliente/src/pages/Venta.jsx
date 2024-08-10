import React from "react";
import './App.css';
import Autosuggest from 'react-autosuggest';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Importa SweetAlert2

const Ventas = () => {
    const [data, setData] = useState([]);
    const [productos, setProductos] = useState([]);
    const [value, setValue] = useState("");
    const [productoSeleccionado, setProductoSeleccionado] = useState({
        id: '',
        nombreProducto: '',
        marca: '',
        precio: ''
    });
    const [cliente, setCliente] = useState({
        nombreProducto: "",
        precio: "",
        nombreCliente: '',
        documentoCliente: '',
        cantidad: ''
    });

    useEffect(() => {
        setCliente(prevCliente => ({
            ...prevCliente,
            nombreProducto: productoSeleccionado.nombreProducto,
            precio: productoSeleccionado.precio
        }));
    }, [productoSeleccionado]);

    const onSuggestionsFetchRequested = ({ value }) => {
        setProductos(filtrarProductos(value));
    };

    const filtrarProductos = (value) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
      
        var filtrado = data.filter((producto) => {
          var textoCompleto = producto.nombreProducto+ "-" +producto.marca;
      
          if (textoCompleto.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .includes(inputValue)) {
            return producto;
          }
        });
      
        return inputLength === 0 ? [] : filtrado;
      };

    const onSuggestionsClearRequested = () => {
        setProductos([]);
    };

    const getSuggestionValue = (suggestion) => suggestion.nombreProducto;

    const renderSuggestion = (suggestion) => (
        <div className='sugerencia' onClick={() => seleccionarProducto(suggestion)}>
            {suggestion.nombreProducto}
        </div>
    );

    const seleccionarProducto = (producto) => {
        setProductoSeleccionado(producto);
        setValue(producto.nombreProducto);
    };

    const onChange = (e, { newValue }) => {
        setValue(newValue);
    };

    const inputProps = {
        placeholder: "Nombre del Producto",
        value,
        onChange
    };

    const obtenerData = () => {
        //axios.get("http://localhost:4000/task")
        axios.get("https://control-stock-06su.onrender.com/task")
        .then(response => {
            setProductos(response.data);
            setData(response.data);
        });
    };

    useEffect(() => {
        obtenerData();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const venta = {
            ...productoSeleccionado,
            nombreCliente: cliente.nombreCliente,
            documentoCliente: cliente.documentoCliente,
            cantidad: cliente.cantidad
        };
       //axios.post("http://localhost:4000/ventas", venta)//local
       axios.post("https://control-stock-06su.onrender.com/ventas", venta)//render
            .then(response => {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'La venta ha sido guardada correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
            })
            .catch(error => {
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un error al guardar la venta.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            });
    };

    const handleClienteChange = (e) => {
        const { name, value } = e.target;
        setCliente(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className="App">
            <div className="autosuggest-container">
                <label htmlFor="product-input" className="autosuggest-label">Seleccione el producto</label>
                <Autosuggest
                    suggestions={productos}
                    onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={{ ...inputProps, id: 'product-input' }}
                />
            </div>
            <br />

            
            <form onSubmit={handleSubmit} className="bg-green-500 text-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h3 className="text-lg font-bold">Formulario de Ventas!</h3>
                <div className="form-group">
                    <label>Nombre del Producto</label>
                    <input type="text" className="border border-gray-400 p-2 rounded-md block my-2 w-full text-black" value={productoSeleccionado.nombreProducto} readOnly />
                </div>
                <div className="form-group">
                    <label>Precio</label>
                    <input type="text" className="border border-gray-400 p-2 rounded-md block my-2 w-full text-black" value={`$${productoSeleccionado.precio}`} readOnly />
                </div>
                <div className="form-group">
                    <label>Cantidad Vendida</label>
                    <input type="number" className="border border-gray-400 p-2 rounded-md block my-2 w-full text-black" name="cantidad" value={cliente.cantidad} onChange={handleClienteChange} />
                </div>
                <div className="form-group">
                    <label>Nombre del Cliente</label>
                    <input type="text" className="border border-gray-400 p-2 rounded-md block my-2 w-full text-black" name="nombreCliente" value={cliente.nombreCliente} onChange={handleClienteChange} />
                </div>
                <div className="form-group">
                    <label>Documento del Cliente</label>
                    <input type="text" className="border border-gray-400 p-2 rounded-md block my-2 w-full text-black" name="documentoCliente" value={cliente.documentoCliente} onChange={handleClienteChange} />
                </div>

                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Guardar Venta</button>
            </form>
        </div>
    );
};

export default Ventas;


